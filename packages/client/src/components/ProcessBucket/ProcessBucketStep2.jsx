import Card from "../UI/Card";
import {
    STEP1,
    STEP2_NOT_ACTIONABLE,
    STEP2_ACTIONABLE,
} from "./ProcessBucketSteps";

export default function ProcessBucketStep2({
    step1Choice,
    step2Choice,
    onChange,
}) {
    if (step1Choice === STEP1.NOT_ACTIONABLE) {
        return (
            <Step2NotActionable
                step2Choice={step2Choice}
                onChange={onChange}
            />
        );
    }

    if (step1Choice === STEP1.ACTIONABLE) {
        return (
            <Step2Actionable
                step2Choice={step2Choice}
                onChange={onChange}
            />
        );
    }

    // אם עוד לא נבחר שלב 1 – לא מציגים כלום
    return null;
}

function Step2NotActionable({ step2Choice, onChange }) {
    return (
        <div className="mt-4">
            <p className="mb-3">Step 2 – What should we do with it?</p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-lg mb-6">
                <Card
                    title="Reference"
                    description="Store it, just in case we need it."
                    selected={step2Choice === STEP2_NOT_ACTIONABLE.REFERENCE}
                    onClick={() => onChange(STEP2_NOT_ACTIONABLE.REFERENCE)}
                />
                <Card
                    title="Someday"
                    description="Nice idea, but not for now."
                    selected={step2Choice === STEP2_NOT_ACTIONABLE.SOMEDAY}
                    onClick={() => onChange(STEP2_NOT_ACTIONABLE.SOMEDAY)}
                />
                <Card
                    title="Trash"
                    description="Not useful, get it out of the way."
                    selected={step2Choice === STEP2_NOT_ACTIONABLE.TRASH}
                    onClick={() => onChange(STEP2_NOT_ACTIONABLE.TRASH)}
                />
            </div>
        </div>
    );
}

function Step2Actionable({ step2Choice, onChange }) {
    return (
        <div className="mt-4">
            <p className="mb-3">Step 2 – What kind of action item is it?</p>

            <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
                <Card
                    title="Next action"
                    description="Single concrete step you can do."
                    selected={step2Choice === STEP2_ACTIONABLE.NEXT_ACTION}
                    onClick={() => onChange(STEP2_ACTIONABLE.NEXT_ACTION)}
                />
                <Card
                    title="Project"
                    description="Requires more than one action."
                    selected={step2Choice === STEP2_ACTIONABLE.PROJECT}
                    onClick={() => onChange(STEP2_ACTIONABLE.PROJECT)}
                />
                <Card
                    title="Waiting for"
                    description="You’re waiting on someone else."
                    selected={step2Choice === STEP2_ACTIONABLE.WAITING}
                    onClick={() => onChange(STEP2_ACTIONABLE.WAITING)}
                />
            </div>
        </div>
    );
}
