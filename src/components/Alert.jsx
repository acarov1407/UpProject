

function Alert({ alert }) {
  return (
    <div
      className={`${alert.error === true ? 'from-red-600 to-red-700' : 'from-sky-600 to-sky-700'} bg-gradient-to-br text-center
    p-3 rounded-lg uppercase text-white mb-5 font-bold text-sm`}
    >
      {alert.msg}
    </div>
  )
}

export default Alert