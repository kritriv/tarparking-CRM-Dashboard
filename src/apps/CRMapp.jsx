import { Suspense } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import AppRouter from "../routers/AppRouter";
// import PdfRouter from "../routers/PdfRouter";
import AuthRouter from "../routers/AuthRouter";
import isLoggedIn from "../utils/isLoggedIn";
import PageLoader from "../components/PageLoader";

export default function CRMpp() {

    if (isLoggedIn())
        return (
            <Suspense fallback={<PageLoader />}>
                <MainLayout>
                    <AppRouter />
                </MainLayout>
                {/* <PdfRouter /> */}
            </Suspense>
        );
    else {
        return <AuthRouter />;
    }
}
