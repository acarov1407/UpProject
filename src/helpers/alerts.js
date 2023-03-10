import Swal from 'sweetalert2'

export const showModalAlert = (data) => {

    Swal.fire({
        title: data.title,
        text: data.msg,
        icon: data.error ? 'error' : 'success',
        background: 'rgb(17 24 39)',
        color: '#fff',
    })

}
export const showAlertDelete = async (titleText) => {
    const result = await Swal.fire({
        title: titleText,
        text: "Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        background: 'rgb(17 24 39)',
        color: '#fff',
        iconColor: 'rgb(245 158 11)'
    })

    return result;
}

