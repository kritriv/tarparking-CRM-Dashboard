import { Modal, Button, notification } from "antd";
import { APIService } from "../../apis";

const DeleteTncModal = ({ visible, onCancel, record, fetchTncData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await APIService.TncApi.deleteResource(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Tnc Details Deleted',
                    description: `${record.name} has been deleted successfully.`,
                });
                fetchTncData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete Tnc.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete Tnc. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Tnc"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete Tnc <b>{TncEmail} ?</b></p> */}
            <p>Are you sure you want to delete this <b>Term & Condition</b> ?</p>
        </Modal>
    );
};

export default DeleteTncModal;
