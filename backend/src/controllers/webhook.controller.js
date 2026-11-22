
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/user.model.js";

export const clerkWebhook = async (req, res) => {
    let event;

    // Step 1: Verify webhook using Clerk
    try {
        event = await verifyWebhook(req);
    } catch (error) {
        console.error("Clerk Webhook Verification Error:", error);

        return res.status(400).json({
            success: false,
            message: "Webhook verification failed"
        });
    }

    // Step 2: Process verified event
    try {
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

        }

        return res.status(200).json({
            success: true,
            message: "Webhook processed successfully"
        });

    } catch (error) {
        console.error("Clerk Webhook Processing Error:", error);

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed"
        });
    }
};
