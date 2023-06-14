import { OrderRepository } from '@apps/store/repositories/order.repository';
import { ResourceOutput } from '@shared/type';
import { Service } from 'typedi';
import { AppException } from '@shared/libs/exception';
import { Errors } from '@apps/store/configs/errors';
import { BookService, BookOutput } from '@apps/store/services/book.service';
import { PromotionService } from '@apps/store/services/promotion.service';
import { UserAuthRepository } from '@apps/auth/repositories/user-auth.repository';
import sendMail from '@shared/libs/mailer';

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
    private readonly orderRepository: OrderRepository,
    private readonly userAuthRepository: UserAuthRepository,
    private readonly promotionService: PromotionService,
  ) {}

  private async validateCreditCard(creditCardNumber: string): Promise<boolean> {
    // Hard-coded credit card number for validation
    const validCreditCardNumber = '121212';
    const isValid = creditCardNumber === validCreditCardNumber;
    return isValid;
  }

  async createOrder(
    userId: string,
    data: CreateOrderInput,
  ): Promise<boolean> {
    const { items, creditCardNumber, couponCode } = data;

    // Check if the credit card number is valid
    const isCreditCardValid = await this.validateCreditCard(creditCardNumber);
    if (!isCreditCardValid) {
      const { errorCode, message, httpCode } = Errors.INVALID_CREDIT_CARD;
      throw new AppException(errorCode, message, httpCode);
    }

    // Validate that all books in the order have sufficient stock
    const bookIds = items.map((item) => item.bookId);
    const books = await this.bookService.findBooksByIds(bookIds);
    const insufficientStockBooks = books.filter((book: BookOutput) => {
      const orderItem = items.find((item) => item.bookId === book.id);
      return book.stock < (orderItem ? 1 : 0);
    });

    if (insufficientStockBooks.length > 0) {
      const { errorCode, message, httpCode } = Errors.INSUFFICIENT_STOCK;
      const bookTitles = insufficientStockBooks.map((book) => book.title);
      const formattedMessage = message.replace('%s', bookTitles.join(', '));
      throw new AppException(errorCode, formattedMessage, httpCode);
    }

    // Calculate the total price of the books
    let totalPrice = books.reduce((total, book) => {
      const orderItem = items.find((item) => item.bookId === book.id);
      return total + (orderItem ? book.price : 0);
    }, 0);

    // Check if coupon code is provided
    if (couponCode) {
      const promotionResult = await this.promotionService.checkCouponCode(
        couponCode,
      );

      if (promotionResult === false) {
        const { errorCode, message, httpCode } = Errors.INVALID_COUPON_CODE;
        throw new AppException(errorCode, message, httpCode);
      }

      // Apply discount if promotion result is valid
      if (
        typeof promotionResult !== 'boolean' &&
        promotionResult?.data?.percentDiscount
      ) {
        const percentDiscount = promotionResult.data.percentDiscount;
        const discountAmount = (totalPrice * percentDiscount) / 100;
        totalPrice -= discountAmount;
      }
    }

    // Create the order
    await this.orderRepository.createGet({
      userId,
      items,
      totalPrice,
    });

    // Decrease the stock of the books in the order
    await Promise.all(
      books.map(async (item) => {
        await this.bookService.decreaseStock(item, 1);
      }),
    );

    // Send email notification to the user
    const userAuth = await this.userAuthRepository.findOne({
      userId,
    });
    const { email } = userAuth;
    const userEmail = email;
    const emailSubject = 'Order Confirmation';
    const emailContent = 'Thank you for your order!';
    await sendMail(userEmail, emailSubject, emailContent);

    return true;
  }
}
