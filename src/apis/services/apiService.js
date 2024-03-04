import apiClient from '../apiClient';

const createApi = (entity) => {

    return {
        Create: `/api/v1/${entity.toLowerCase()}/add`,
        List: `/api/v1/${entity.toLowerCase()}s`,
        Read: `/api/v1/${entity.toLowerCase()}`,
        Delete: `/api/v1/${entity.toLowerCase()}`,
        Update: `/api/v1/${entity.toLowerCase()}`,
    };
};

const generateResourceApi = (entity) => {
    const apiConfig = createApi(entity);

    const createResource = (data) => apiClient.post({ url: apiConfig.Create, data });
    const listResource = (page, size, query, category) => {
        let url = apiConfig.List;

        if (page !== undefined && size !== undefined) {
            url += `?page=${page}&size=${size}`;
        }

        if (query) {
            url += `&query=${query}`;
        }

        if (category) {
            url += `?${category}`;
        }

        return apiClient.get({ url });
    };
    const readResource = (id) => apiClient.get({ url: `${apiConfig.Read}/${id}` });
    const deleteResource = (id) => apiClient.delete({ url: `${apiConfig.Delete}/${id}` });
    const updateResource = (id, data) => apiClient.put({ url: `${apiConfig.Update}/${id}`, data });

    return {
        createResource,
        listResource,
        readResource,
        deleteResource,
        updateResource,
    };
};

export const UserApi = generateResourceApi('User');
export const CompanyApi = generateResourceApi('Company');
export const ClientApi = generateResourceApi('Client');
export const CategoryApi = generateResourceApi('Category');
export const ProductApi = generateResourceApi('Product');
export const SubProductApi = generateResourceApi('SubProduct');
