import nodemailer from "nodemailer";
import config from "../../config";

const emailSender = async (email:string,html:string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.email,
      pass: config.pass,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"PH Health Care" <abulalajobayar@gmail.com>', // sender address
    to:email, // list of receivers
    subject: "Reset Password Link", // Subject line
//     text: "Hello world?", // plain text body
    html
  });

  console.log("Message sent: %s", info.messageId);
};
export default emailSender
