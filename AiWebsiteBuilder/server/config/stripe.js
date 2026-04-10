import dotenv from "dotenv";
dotenv.config();
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECERET_KEY);
export default stripe;
