import { Modal, Button, notification } from "antd";
import { APIService } from "../../apis";

const DeleteQuoteModal = ({ visible, onCancel, record, fetchQuoteData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await APIService.QuoteApi.deleteResource(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Quote Deleted',
                    description: `${record.ref} has been deleted successfully.`,
                });
                fetchQuoteData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete Quote.',
                });
            }
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Error',
                description: 'Failed to delete Quote. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Quote"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete Quote <b>{QuoteEmail} ?</b></p> */}
            <p>Are you sure you want to delete this Quote ?</p>
        </Modal>
    );
};

export default DeleteQuoteModal;
