import React from 'react'

const CustomTab = ({ key, tab, activeTab, setActiveTab }) => {
    console.log(tab)
    return (
        <li key={key} className="me-2">
            <a
                href="#"
                className={`inline-block p-4 border-b-[3px] rounded-t-lg ${activeTab === tab?.name
                    ? ' border-[#4B40EE] '
                    : 'border-transparent hover:border-gray-300 text-[#333]'
                    }`}
                onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab?.name);
                }}
                aria-current={activeTab === tab?.name ? 'page' : undefined}
            >
                {tab?.name}
            </a>
        </li>

    )
}

export default CustomTab
