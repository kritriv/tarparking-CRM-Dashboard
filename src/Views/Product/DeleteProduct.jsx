import { Modal, Button, notification } from "antd";
import { APIService } from "../../apis";

const DeleteProductModal = ({ visible, onCancel, record, fetchProductData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await APIService.ProductApi.deleteResource(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Product Details Deleted',
                    description: `${record.name} has been deleted successfully.`,
                });
                fetchProductData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete product.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete product. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Product"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete product <b>{ProductEmail} ?</b></p> */}
            <p>Are you sure you want to delete this product ?</p>
        </Modal>
    );
};

export default DeleteProductModal;
