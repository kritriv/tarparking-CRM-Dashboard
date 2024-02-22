import { Modal, Button, notification } from "antd";
import { UsersServicesAPI } from "../../apis";

const DeleteUserModal = ({ visible, onCancel, record, fetchUserData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await UsersServicesAPI.deleteUser(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'User Deleted',
                    description: `${record.email} has been deleted successfully.`,
                });
                fetchUserData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete user.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete user. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete User"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete user <b>{UserEmail} ?</b></p> */}
            <p>Are you sure you want to delete this user ?</p>
        </Modal>
    );
};

export default DeleteUserModal;
