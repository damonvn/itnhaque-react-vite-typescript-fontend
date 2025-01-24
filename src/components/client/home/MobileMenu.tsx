import React, { useState } from 'react';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import './MobileMenu.scss'


const MobileMenu: React.FC = () => {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    return (
        <>
            <div
                className='mobile-menu-container-responsive'
                style={{ fontSize: '28px', cursor: 'pointer', display: 'none', marginRight: '5px' }}
                onClick={() => setIsOpened((prev) => {
                    const newState = !prev;
                    return newState;
                })}
            >
                {!isOpened && <MenuOutlined className='mobile-menu-icon' />}
                {isOpened && <CloseOutlined className='mobile-close-icon' />}

            </div>
            {
                isOpened &&
                <ul
                    style={{
                        position: 'fixed', left: 0, margin: 0, padding: 0, listStyle: 'none',
                        top: '60px', width: '100%', boxSizing: 'border-box', zIndex: '10',
                    }}
                    className='mobile-menu'
                >
                    <li
                        style={{ paddingTop: '20px' }}
                        onClick={() => setIsOpened(false)}
                    >
                        Tất cả
                    </li>
                    <li onClick={() => setIsOpened(false)}>Frontend</li>
                    <li onClick={() => setIsOpened(false)}>Backend</li>
                </ul>
            }

        </>
    );
};

export default MobileMenu;