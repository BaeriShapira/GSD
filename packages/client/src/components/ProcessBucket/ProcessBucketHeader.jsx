import AttachmentList from "../UI/AttachmentList";

export default function ProcessBucketHeader({
    currentIndex, // מספר האייטם הנוכחי (1-based)
    total,        // כמות כללית לתהליך
    title,        // הטקסט של האייטם
    attachments = [], // קבצים מצורפים
}) {

    return (
        <>
            <div className="mb-6">
                <p1>
                    Process bucket {currentIndex}/{total}
                </p1>
            </div>

            <h2 className="mb-4">
                {title}
            </h2>

            <AttachmentList attachments={attachments} className="mb-4" />
        </>
    );
}
