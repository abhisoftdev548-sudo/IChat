import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

        if (!webhookSecret) {
            return res.status(500).json({
                success: false,
                message: "Webhook secret is missing"
            });
        }

        const svixId = req.headers["svix-id"];
        const svixTimestamp = req.headers["svix-timestamp"];
        const svixSignature = req.headers["svix-signature"];

        if (!svixId || !svixTimestamp || !svixSignature) {
            return res.status(400).json({
                success: false,
                message: "Missing webhook headers"
            });
        }

        const webhook = new Webhook(webhookSecret);

        const event = webhook.verify(
            req.body,
            {
                "svix-id": svixId,
                "svix-timestamp": svixTimestamp,
                "svix-signature": svixSignature
            }
        );

        const { type, data } = event;

        switch (type) {

            case "user.created":
            case "user.updated": {
                const email = data.email_addresses?.find(
                    item => item.id === data.primary_email_address_id
                )?.email_address;

                if (!email) {
                    return res.status(400).json({
                        success: false,
                        message: "User email not found"
                    });
                }

                const userData = {
                    clerkId: data.id,
                    email,
                    fullName: [
                        data.first_name,
                        data.last_name
                    ].filter(Boolean).join(" ") || email,
                    avatar: data.image_url || ""
                };

                await User.findOneAndUpdate(
                    { clerkId: data.id },
                    { $set: userData },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    }
                );

                break;
            }

            case "user.deleted": {
                await User.findOneAndDelete({
                    clerkId: data.id
                });

                break;
            }

            default:
                console.log(`Unhandled Clerk event: ${type}`);
        }

        return res.status(200).json({
            success: true,
            message: "Webhook processed successfully"
        });

    } catch (error) {
        console.error("Clerk Webhook Error:", error);

        return res.status(400).json({
            success: false,
            message: "Webhook verification or processing failed"
        });
    }
};