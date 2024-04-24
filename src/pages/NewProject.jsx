import FormProject from "../components/FormProject"

function NewProject() {
  return (
    <>
    <h1 className="text-4xl font-black text-white">Create Project</h1>
    <div className="mt-10 flex justify-center">
      <FormProject />
    </div>
    </>
  )
}

export default NewProject