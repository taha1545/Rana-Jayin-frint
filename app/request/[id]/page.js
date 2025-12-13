"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import RequestServices from "@/services/RequestServices";
import { useTranslation } from "@/hooks/useTranslation";

export default function RequestPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const router = useRouter();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);

    const [rating, setRating] = useState(0);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await RequestServices.getRequestById(id);
                if (res?.success) {
                    setRequest(res.data);
                } else {
                    setError(res?.message || "Failed to load request");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load request");
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]); // ✅ DO NOT ADD `t`

    const handleCancel = async () => {
        if (!request) return;
        setCancelling(true);
        try {
            const res = await RequestServices.updateRequest(request.id, { status: "cancelled" });
            if (res?.success) {
                setRequest({ ...request, status: "cancelled" });
            } else {
                setError(res?.message || "Failed to cancel the request");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while cancelling the request");
        } finally {
            setCancelling(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!request || rating <= 0) return;
        setSubmittingReview(true);
        setReviewMessage("");
        try {
            const res = await RequestServices.createReviewForStore(request.storeId, {
                storeId: request.storeId,
                clientId: request.clientId,
                rating,
            });
            if (res?.success) {
                setReviewMessage(t("review.successMessage"));
                setReviewSubmitted(true);
            } else {
                setReviewMessage(res?.message || t("review.failedMessage"));
            }
        } catch (err) {
            console.error(err);
            setReviewMessage(t("review.errorMessage"));
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <p className="text-center p-4">{t("loading")}</p>;

    if (error)
        return (
            <p className="text-center p-4 text-red-600 font-medium">{error}</p>
        );

    if (!request) return <p className="text-center p-4">{t("request.notFound")}</p>;

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-background flex justify-center">
            <Card className="w-full max-w-lg border-2 border-primary shadow-xl flex flex-col">
                <CardHeader className="relative">
                    <CardTitle className="text-xl font-bold text-secondary-foreground">
                        {t("request.title")}
                    </CardTitle>
                    <button
                        onClick={() => router.back()}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-secondary-foreground p-1 rounded-full bg-white dark:bg-gray-800 shadow-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-muted-foreground">
                            {t("request.serviceType")}
                        </p>
                        <p className="text-secondary-foreground">
                            {request.serviceType}
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="font-medium text-muted-foreground">
                            {t("request.status")}
                        </p>
                        <p
                            className={`px-3 py-1 rounded-full font-semibold ${
                                request.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : request.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {request.status}
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="font-medium text-muted-foreground">
                            {t("request.createdAt")}
                        </p>
                        <p className="text-secondary-foreground">
                            {request.createdAt}
                        </p>
                    </div>

                    {request.completedAt && (
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-muted-foreground">
                                {t("request.completedAt")}
                            </p>
                            <p className="text-secondary-foreground">
                                {request.completedAt}
                            </p>
                        </div>
                    )}

                    {request.status === "pending" && (
                        <Button
                            className="w-full mt-4 h-12 text-base font-semibold"
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={cancelling}
                        >
                            {cancelling ? t("cancelling") : t("cancelRequest")}
                        </Button>
                    )}

                    {!reviewSubmitted && (
                        <div className="mt-6 border-t border-muted-foreground/20 pt-4">
                            <p className="font-medium text-muted-foreground mb-2">
                                {t("review.rateStore")}
                            </p>

                            <div className="flex items-center mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl mr-1 transition-colors duration-150 ${
                                            rating >= star
                                                ? "text-yellow-400 hover:text-yellow-500"
                                                : "text-gray-300 hover:text-gray-400"
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <Button
                                className="w-full h-10 text-base font-medium"
                                onClick={handleSubmitReview}
                                disabled={submittingReview || rating === 0}
                            >
                                {submittingReview
                                    ? t("review.submitting")
                                    : t("review.submit")}
                            </Button>

                            {reviewMessage && (
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                    {reviewMessage}
                                </p>
                            )}
                        </div>
                    )}

                    {reviewSubmitted && (
                        <p className="mt-4 text-sm text-green-600 font-medium">
                            {t("review.successMessage")} ✅
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
