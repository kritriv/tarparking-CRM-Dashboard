import { Modal, Button, notification } from "antd";
import { ClientServicesAPI } from "../../apis";

const DeleteClientModal = ({ visible, onCancel, record, fetchClientData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await ClientServicesAPI.deleteClient(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Client Deleted',
                    description: `${record.email} has been deleted successfully.`,
                });
                fetchClientData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete Client.',
                });
            }
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Error',
                description: 'Failed to delete Client. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Client"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete Client <b>{ClientEmail} ?</b></p> */}
            <p>Are you sure you want to delete this Client ?</p>
        </Modal>
    );
};

export default DeleteClientModal;
