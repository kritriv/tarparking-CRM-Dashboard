import apiClient from '../apiClient';

export const CompanyApi = {
    Create: '/api/v1/company/add',
    List: '/api/v1/companys',
    Read: '/api/v1/company',
    Delete: '/api/v1/company',
    Update: '/api/v1/company',
};

const createCompany = (data) => apiClient.post({ url: CompanyApi.Create, data });
const listCompany = (page, size) => apiClient.get({ url: `${CompanyApi.List}?page=${page}&size=${size}` });
const readCompany = (id) => apiClient.get({ url: `${CompanyApi.Read}/${id}` });
const deleteCompany = (id) => apiClient.delete({ url: `${CompanyApi.Delete}/${id}` });
const updateCompany = (id, data) => apiClient.put({ url: `${CompanyApi.Update}/${id}`, data });

export {
    createCompany,
    listCompany,
    readCompany,
    deleteCompany,
    updateCompany,
};
