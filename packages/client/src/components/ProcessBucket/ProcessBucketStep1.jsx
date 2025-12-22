import Card from "../UI/Card";
import { STEP1 } from "./ProcessBucketSteps";

export default function ProcessBucketStep1({ step1Choice, onChange }) {
    return (
        <div className="process-bucket-step1 mt-4">
            <p className="mb-3 dark:text-white">Step 1 – Is it actionable?</p>

            <div className="grid gap-4 sm:grid-cols-2 max-w-xl mb-6">
                <Card
                    title="Not actionable"
                    description="Reference, someday, trash."
                    selected={step1Choice === STEP1.NOT_ACTIONABLE}
                    onClick={() => onChange(STEP1.NOT_ACTIONABLE)}
                />

                <Card
                    title="Actionable"
                    description="Turn it into a task with a clear next action."
                    selected={step1Choice === STEP1.ACTIONABLE}
                    onClick={() => onChange(STEP1.ACTIONABLE)}
                />
            </div>
        </div>
    );
}
