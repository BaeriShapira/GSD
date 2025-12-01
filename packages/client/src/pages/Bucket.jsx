import QuickCaptureBoard from "../components/bucket/QuickCaptureBoard";


export default function Bucket() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Bucket </h1>
                <p> All unprocessed stuff that landed on your desk. </p>
            </div>
            <QuickCaptureBoard />
        </section>
    );
}
