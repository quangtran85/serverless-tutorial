import { OrderRepository } from '@apps/store/repositories/order.repository';
import { ResourceOutput } from '@shared/type';
import { Service } from 'typedi';
import { AppException } from '@shared/libs/exception';
import { Errors } from '@apps/store/configs/errors';
import { BookService, BookOutput } from '@apps/store/services/book.service';
import { PromotionService } from '@apps/store/services/promotion.service';
import { UserService } from './user.service';
import Mailer from '@shared/libs/mailer';
import * as dotenv from 'dotenv';
dotenv.config();

export type OrderItem = {
  bookId: string;
};

export type OrderOutput = ResourceOutput & {
  userId: string;
  items: OrderItem[];
  totalPrice: number;
};

export type CreateOrderInput = {
  items: OrderItem[];
  creditCardNumber: string;
  couponCode?: string;
};

@Service()
export class OrderService {
  constructor(
    private readonly bookService: BookService,
    private readonly userService: UserService,
    private readonly orderRepository: OrderRepository,
    private readonly promotionService: PromotionService,
  ) {}

  private async validateCreditCard(creditCardNumber: string): Promise<boolean> {
    // Hard-coded credit card number for validation
    const validCreditCardNumber = '1111111111111111';
    return creditCardNumber === validCreditCardNumber;
  }

  async createOrder(userId: string, data: CreateOrderInput): Promise<boolean> {
    const { items, creditCardNumber, couponCode } = data;
    const uniqueItems = [...new Set(items)];

    // Check if the credit card number is valid
    const isCreditCardValid = await this.validateCreditCard(creditCardNumber);
    if (!isCreditCardValid) {
      const { errorCode, message, httpCode } = Errors.INVALID_CREDIT_CARD;
      throw new AppException(errorCode, message, httpCode);
    }

    // Validate that all books in the order have sufficient stock
    const bookIds = uniqueItems.map((item) => item.bookId);
    const books = await this.bookService.findBooksByIds(bookIds);
    const insufficientStockBooks = books.filter((book: BookOutput) => {
      return book.stock < 1;
    });

    if (insufficientStockBooks.length > 0) {
      const { errorCode, message, httpCode } = Errors.INSUFFICIENT_STOCK;
      const bookTitles = insufficientStockBooks.map((book) => book.title);
      const formattedMessage = message.replace('%s', bookTitles.join(', '));
      throw new AppException(errorCode, formattedMessage, httpCode);
    }

    // Calculate the total price of the books
    let totalPrice = books.reduce((total, book) => {
      return total + book.price;
    }, 0);

    // Check if coupon code is provided
    if (couponCode) {
      const promotionResult = await this.promotionService.checkCouponCode(
        couponCode,
      );

      if (promotionResult.data === false) {
        const { errorCode, message, httpCode } = Errors.INVALID_COUPON_CODE;
        throw new AppException(errorCode, message, httpCode);
      }

      // Apply discount if promotion result is valid
      if (
        typeof promotionResult.data !== 'boolean' &&
        promotionResult?.data?.percentDiscount
      ) {
        const percentDiscount = promotionResult.data?.percentDiscount;
        const discountAmount = (totalPrice * percentDiscount) / 100;
        totalPrice -= discountAmount;
      }
    }

    // Create the order
    const orderItems = books.map((item) => {
      return {
        bookId: item.id,
        title: item.title,
        price: item.price,
      };
    });

    await this.orderRepository.createGet({
      userId,
      items: orderItems,
      totalPrice,
    });

    // Decrease the stock of the books in the order
    await Promise.all(
      books.map(async (item) => {
        await this.bookService.decreaseStock(item, 1);
      }),
    );

    // Send email notification to the user
    const user = await this.userService.getUserById(userId);
    const userEmail = user.data.email;
    const emailSubject = 'Order Confirmation';
    const emailContent = 'Thank you for your order!';
    const option = {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      username: process.env.MAIL_USERNAME,
      password: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM,
    };
    const mailer = new Mailer(option);
    await mailer.sendMail(userEmail, emailSubject, emailContent);

    return true;
  }
}
