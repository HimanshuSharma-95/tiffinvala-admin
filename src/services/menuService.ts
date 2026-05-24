// import api from '@/lib/api'

// export const getAllProducts = async () => {
//     const response = await api.get('/products/all')
//     return response.data
// }

// export const getProductsGrouped = async () => {
//     const response = await api.get('/products/all?grouped=true')
//     return response.data
// }

// export const getAllCombos = async () => {
//     const response = await api.get('/products/combos')
//     return response.data
// }

// export const getCategories = async () => {
//     const response = await api.get('/products/allrootcategories')
//     return response.data
// }

// // export const createProduct = async (data: FormData) => {
// //     const response = await api.post('/products/createproduct', data, {
// //         headers: { 'Content-Type': 'multipart/form-data' }
// //     })
// //     return response.data
// // }

// export const createProduct = async (data: any) => {
//     const response = await api.post('/products/createproduct', data)
//     return response.data
// }

// export const getSingleProduct = async (id: string) => {
//     const response = await api.get(`/products/${id}`)
//     return response.data
// }

// export const updateProduct = async (id: string, data: object) => {
//     const response = await api.patch(`/products/updateproduct/${id}`, data, {
//         headers: { 'Content-Type': 'application/json' }
//     })
//     return response.data
// }

// export const updateProductImage = async (id: string, image: File) => {
//     const formData = new FormData()
//     formData.append('image', image)
//     const response = await api.patch(`/products/updateimage/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return response.data
// }

// export const createCombo = async (data: object) => {
//     const response = await api.post('/products/createcombo', data)
//     return response.data
// }

// export const updateCombo = async (id: string, data: object) => {
//     const response = await api.patch(`/products/updatecombo/${id}`, data)
//     return response.data
// }

// export const getAreaProducts = async (area: string) => {
//     const response = await api.get(`/products/admin/products/areastatus/${area}`)
//     return response.data
// }

// export const makeProductLiveInArea = async (id: string, area: string) => {
//     const response = await api.patch(`/products/admin/products/makeliveinarea/${id}`, { area })
//     return response.data
// }

// export const removeProductFromArea = async (id: string, area: string) => {
//     const response = await api.patch(`/products/admin/products/removefromarea/${id}`, { area })
//     return response.data
// }

// export const removeProductImage = async (id: string) => {
//     const response = await api.patch(`/products/removeproductimage/${id}`)
//     return response.data
// }

// export const removeComboImage = async (id: string) => {
//     const response = await api.patch(`/products/removecomboimage/${id}`)
//     return response.data
// }

// export const addCategory = async (name: string) => {
//     const response = await api.post('/products/addcategory', { name })
//     return response.data
// }

// export const removeCategory = async (id: string) => {
//     const response = await api.delete(`/products/removecategory/${id}`)
//     return response.data
// }

// export const updateComboImage = async (id: string, image: File) => {
//     const formData = new FormData()
//     formData.append('image', image)
//     const response = await api.patch(`/products/updatecomboimage/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return response.data
// }

// export const getSingleCombo = async (id: string) => {
//     const response = await api.get(`/products/singlecombo/${id}`)
//     return response.data
// }









import api from '@/lib/api'

/* =========================================================
   PRODUCTS - FETCH
========================================================= */

// Get all products
export const getAllProducts = async () => {
    const response = await api.get('/products/all')
    return response.data
}

// Get grouped products (grouped by categories/subcategories etc.)
export const getProductsGrouped = async () => {
    const response = await api.get('/products/all?grouped=true')
    return response.data
}

// Get products available in a specific area
export const getAreaProducts = async (area: string) => {
    const response = await api.get(
        `/products/admin/products/areastatus/${area}`
    )
    return response.data
}

// Get single product details by ID
export const getSingleProduct = async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
}


/* =========================================================
   PRODUCTS - CREATE / UPDATE
========================================================= */

// Create a new product
export const createProduct = async (data: any) => {
    const response = await api.post('/products/createproduct', data)
    return response.data
}

// Update product details
export const updateProduct = async (id: string, data: object) => {
    const response = await api.patch(
        `/products/updateproduct/${id}`,
        data,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    return response.data
}

// Make product live in a specific area
export const makeProductLiveInArea = async (
    id: string,
    area: string
) => {
    const response = await api.patch(
        `/products/admin/products/makeliveinarea/${id}`,
        { area }
    )

    return response.data
}

// Remove product from a specific area
export const removeProductFromArea = async (
    id: string,
    area: string
) => {
    const response = await api.patch(
        `/products/admin/products/removefromarea/${id}`,
        { area }
    )

    return response.data
}


/* =========================================================
   PRODUCT IMAGES
========================================================= */

// Update product image
export const updateProductImage = async (
    id: string,
    image: File
) => {
    const formData = new FormData()
    formData.append('image', image)

    const response = await api.patch(
        `/products/updateimage/${id}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    return response.data
}

// Remove product image
export const removeProductImage = async (id: string) => {
    const response = await api.patch(
        `/products/removeproductimage/${id}`
    )

    return response.data
}


/* =========================================================
   COMBOS - FETCH
========================================================= */

// Get all combos
export const getAllCombos = async () => {
    const response = await api.get('/products/combos')
    return response.data
}

// Get single combo by ID
export const getSingleCombo = async (id: string) => {
    const response = await api.get(`/products/singlecombo/${id}`)
    return response.data
}


/* =========================================================
   COMBOS - CREATE / UPDATE / DELETE
========================================================= */

// Create combo
export const createCombo = async (data: object) => {
    const response = await api.post(
        '/products/createcombo',
        data
    )

    return response.data
}

// Update combo
export const updateCombo = async (
    id: string,
    data: object
) => {
    const response = await api.patch(
        `/products/updatecombo/${id}`,
        data
    )

    return response.data
}

// Delete combo
export const deleteCombo = async (id: string) => {
    const response = await api.delete(
        `/products/deletecombo/${id}`
    )

    return response.data
}


/* =========================================================
   COMBO IMAGES
========================================================= */

// Update combo image
export const updateComboImage = async (
    id: string,
    image: File
) => {
    const formData = new FormData()
    formData.append('image', image)

    const response = await api.patch(
        `/products/updatecomboimage/${id}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    return response.data
}

// Remove combo image
export const removeComboImage = async (id: string) => {
    const response = await api.patch(
        `/products/removecomboimage/${id}`
    )

    return response.data
}


/* =========================================================
   CATEGORIES
========================================================= */

// Get all root categories
export const getCategories = async () => {
    const response = await api.get(
        '/products/allrootcategories'
    )

    return response.data
}

// Add category
export const addCategory = async (name: string) => {
    const response = await api.post(
        '/products/addcategory',
        { name }
    )

    return response.data
}

// Remove category
export const removeCategory = async (id: string) => {
    const response = await api.delete(
        `/products/removecategory/${id}`
    )

    return response.data
}






export const getAreaCombos = async (area: string) => {
    const response = await api.get(
        `/products/admin/combos/areastatus/${area}`
    )

    return response.data
}

export const makeComboLiveInArea = async (
    id: string,
    area: string
) => {
    const response = await api.patch(
        `/products/admin/combos/makeliveinarea/${id}`,
        { area }
    )

    return response.data
}

export const removeComboFromArea = async (
    id: string,
    area: string
) => {
    const response = await api.patch(
        `/products/admin/combos/removefromarea/${id}`,
        { area }
    )

    return response.data
}

export const deleteProduct = async (id: string) => {
    return api.delete(`/products/delete/${id}`)
}