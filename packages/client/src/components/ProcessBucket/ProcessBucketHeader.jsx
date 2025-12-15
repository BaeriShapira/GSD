import AttachmentList from "../UI/AttachmentList";

export default function ProcessBucketHeader({
    currentIndex, // מספר האייטם הנוכחי (1-based)
    total,        // כמות כללית לתהליך
    title,        // הטקסט של האייטם
    attachments = [], // קבצים מצורפים
}) {

    return (
        <>
            <div className="process-bucket-header mb-6">
                <p1>
                    Process bucket {currentIndex}/{total}
                </p1>

                <h2 className="mt-2">
                    {title}
                </h2>

                <AttachmentList attachments={attachments} className="mt-4" />
            </div>
        </>
    );
}
