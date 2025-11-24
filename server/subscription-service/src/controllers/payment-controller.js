const Stripe = require("stripe");
const Subscription = require("../models/subscription");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ------------------- CREATE ORDER (Stripe Checkout) -------------------

exports.createOrder = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Canva Premium Membership",
            },
            unit_amount: 500 * 100, // $500 → Stripe requires cents
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/subscription/cancel`,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: session.id,       // same name as PayPal
        approvalLink: session.url, // same name as PayPal
      },
    });
  } catch (e) {
    console.log("Stripe error:", e);
    res.status(500).json({
      success: false,
      message: "Error while creating stripe order",
    });
  }
};


// ------------------- CAPTURE PAYMENT -------------------

exports.capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { userId } = req.user;

    // Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(orderId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const paymentId = session.payment_intent;

    let subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      subscription = new Subscription({ userId });
    }

    subscription.isPremium = true;
    subscription.premiumSince = new Date();
    subscription.paymentId = paymentId;

    await subscription.save();

    res.status(200).json({
      success: true,
      data: {
        isPremium: true,
        paymentId,
      },
    });
  } catch (e) {
    console.log("Stripe capture error:", e);
    res.status(500).json({
      success: false,
      message: "Error while capturing stripe payment",
    });
  }
};


// ------------------- VERIFY PAYMENT (Optional) -------------------

exports.verifyPayment = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Stripe payment verification not required",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error while verifying payment",
    });
  }
};
