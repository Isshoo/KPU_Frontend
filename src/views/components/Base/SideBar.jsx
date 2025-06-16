import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineLeaderboard } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { FiLogOut } from 'react-icons/fi';
import { LocaleConsumer } from '../../../contexts/LocaleContext';
import { GrDocumentStore } from 'react-icons/gr';
import { GiWorld } from 'react-icons/gi';

const SideBar = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/user')) {
    return (
      <LocaleConsumer>
        {({ locale }) => {
          return (
            <nav className='side-bar'>
              <ul className='side'>
                <li>
                  <Link
                    className={`side-button ${location.pathname.startsWith('/user/home') ? 'active' : ''}`}
                    to='/user/home'
                  >
                    <GoHome className='side-icon' />
                    <p>{locale === 'EN' ? 'Home' : 'Beranda'}</p>
                  </Link>
                </li>
              </ul>
            </nav>
          );
        }}
      </LocaleConsumer>
    );
  }
  if (location.pathname.startsWith('/admin')) {
    return (
      <LocaleConsumer>
        {({ locale }) => {
          return (
            <nav className='side-bar'>
              <ul className='side'>
                <li>
                  <Link
                    className={`side-button ${location.pathname.startsWith('/admin/home') ? 'active' : ''}`}
                    to='/admin/home'
                  >
                    <GoHome className='side-icon' />
                    <p>{locale === 'EN' ? 'Home' : 'Beranda'}</p>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`side-button ${location.pathname.startsWith('/admin/datasets') ? 'active' : ''}`}
                    to='/admin/datasets'
                  >
                    <GrDocumentStore className='side-icon datasets-icon' />
                    <p>{locale === 'EN' ? 'Datasets' : 'Kumpulan Data'}</p>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`side-button ${location.pathname.startsWith('/admin/models') ? 'active' : ''}`}
                    to='/admin/models'
                  >
                    <GiWorld className='side-icon models-icon' />
                    <p>{locale === 'EN' ? 'Models' : 'Model'}</p>
                  </Link>
                </li>
              </ul>
              <p className='copyright'>&copy; Copyright Kelompok 5</p>
            </nav>
          );
        }}
      </LocaleConsumer>
    );
  }

  return '';
};

export default SideBar;
