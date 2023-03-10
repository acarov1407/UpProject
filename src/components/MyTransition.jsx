import { Transition } from '@headlessui/react'

function MyTransition({ children, isOpen }) {
    return (
        <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
        >
            {children}
        </Transition>
    )
}

export default MyTransition