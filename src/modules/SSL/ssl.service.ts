import axios from "axios";
import config from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const sslInit = async (datas: any) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_pass,
      total_amount: datas.amount,
      currency: "BDT",
      tran_id: datas.transactionId, // use unique tran_id for each api call
      success_url: config.ssl.success_url,
      fail_url: config.ssl.fail_url,
      cancel_url: config.ssl.cancel_url,
      ipn_url: "N/A",
      shipping_method: "N/A",
      product_name: "N/A",
      product_category: "N/A",
      product_profile: "N/A",
      cus_name: datas.appointment.patient.name,
      cus_email: datas.appointment.patient.email,
      cus_add1: datas.appointment.patient.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: datas.appointment.patient.contactNumber,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const response = await axios({
      method: "post",
      url: config.ssl.sandbox_url,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment error");
  }
};
const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.validationApi}?val_id=${payload.val_id}& store_id${config.ssl.store_id}&storePasswd ${config.ssl.store_pass}& format=json `,
    });
    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment validation Error");
  }
};
export const SslService = {
  sslInit,
  validatePayment,
};
