import { Fragment, useState } from 'react'
import { BlitzPage, Link } from 'blitz'
import { Listbox, Transition } from '@headlessui/react'
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'

import base64url from 'base64url'

const ConnectSelector: BlitzPage = () => {
  const [selected, setSelected] = useState<Element>()

  return (
    <div className="my-2 mt-0">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative ">
          <Listbox.Button className="z-10 md:w-64  border relative w-full py-2 px-3 pr-6 text-left items-center bg-white text-gray-800 rounded-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <AiOutlineSearch />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-out duration-75 z-0 transform"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="-translate-y-10 opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <Listbox.Option
                value="1"
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 px-2`
                }
              >
                <Link
                  href={`https://github.com/apps/${
                    process.env.NODE_ENV === 'production' ? 'worffl' : 'worffl'
                  }/installations/new?state=${base64url(JSON.stringify({ next: '/new' }))}`}
                >
                  <button className="w-full items-center flex text-justify hover:bg-gray-100 rounded p-2">
                    <AiOutlinePlus /> <span className="ml-2">Add GitHub Account or Org</span>
                  </button>
                </Link>
              </Listbox.Option>
              <Listbox.Option
                value="1"
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 px-2`
                }
              >
                babo
              </Listbox.Option>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
export default ConnectSelector
