import ProcessBucketBoard from "../components/ProcessBucket/ProcessBucketBoard";


export default function ProcessBucket() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Process bucket  </h1>
                <p> Decide, for each item, whether it’s actionable. If yes – define the next action. </p>
            </div>
            <ProcessBucketBoard />
        </section>
    );
}
