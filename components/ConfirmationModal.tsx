"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { FaExclamationTriangle } from "react-icons/fa"

export default function ConfirmationModal({ isOpen, onClose, onConfirm }: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    }) {
    return (
        <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                <FaExclamationTriangle className="text-yellow-500 w-6 h-6" />
                <Dialog.Title className="text-lg font-semibold">削除の確認</Dialog.Title>
                </div>
                <Dialog.Description className="text-gray-700 mb-4">
                本当にこの投稿を削除しますか？この操作は元に戻せません。
                </Dialog.Description>
                <div className="flex justify-end space-x-3">
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={onClose}
                >
                    キャンセル
                </button>
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => {
                    onConfirm()
                    onClose()
                    }}
                >
                    削除する
                </button>
                </div>
            </Dialog.Panel>
            </div>
        </Dialog>
        </Transition>
    )
    }
