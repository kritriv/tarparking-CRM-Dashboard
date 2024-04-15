import { Modal, Button, notification } from "antd";
import { APIService } from "../../apis";

const DeleteLeadModal = ({ visible, onCancel, record, fetchLeadData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await APIService.LeadApi.deleteResource(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Lead Deleted',
                    description: `${record.id} has been deleted successfully.`,
                });
                fetchLeadData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete Lead.',
                });
            }
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Error',
                description: 'Failed to delete Lead. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Lead"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete Lead <b>{LeadEmail} ?</b></p> */}
            <p>Are you sure you want to delete this Lead ?</p>
        </Modal>
    );
};

export default DeleteLeadModal;
