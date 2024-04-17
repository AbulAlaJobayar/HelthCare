import axios from "axios";
import { prisma } from "../../shared/prisma";
import { SslService } from "../SSL/ssl.service";
import config from "../../config";
import { PaymentStatus } from "@prisma/client";

const initPayment = async (appointmentId: string) => {
  console.log(appointmentId);
  const appointment = await prisma.payment.findUniqueOrThrow({
    where: {
      appointmentId: appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const result = await SslService.sslInit(appointment);
console.log(result)
  return {
    payment_url: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  /*HTTP POST Parameters will be throw to the IPN_HTTP_URL as amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=progr661a36ca38a29&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=261408bf93dee2d1a88f1d60461f82ad&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id*/
  if (!payload || !payload.status || !(payload.status === "VALID")) {
    return {
      message: "Invalid Payment",
    };
  }

  const response = await SslService.validatePayment(payload);
  if (response.status !== "VALID") {
    return {
      message: "Payment Faild",
    };
  }
 
  await prisma.$transaction(async (tx) => {
    const updateData = await tx.payment.update({
      where: {
        transactionId:response?.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });
    await tx.appointment.update({
      where: {
        id: updateData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });
  return {
    message: "payment success",
  };
};
export const PaymentService = {
  initPayment,
  validatePayment,
};
