import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useAuth, User } from '../../../context/AuthContext'; 


const UserListForm: React.FC = () => {
  const { fetchAllUsers, user, acceptUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openCertificates, setOpenCertificates] = useState<{ [key: number]: boolean }>({});
  const [openPortfolios, setOpenPortfolios] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const getUsers = async (page: number) => {
      if (user) {
        const response = await fetchAllUsers(page);
        const { data, last_page } = response;
        setUsers(data.filter((u: User) => u.id !== user.id));
        setTotalPages(last_page);
      }
    };

    getUsers(currentPage);
  }, [fetchAllUsers, user, currentPage]);

  const toggleUserStatus = async (id: number) => {
    const updatedUsers = users.map(u =>
      u.id === id ? { ...u, verified: !u.verified } : u
    );
    setUsers(updatedUsers);
    
    const success = await acceptUser(id, updatedUsers.find(u => u.id === id)?.verified || false);
    
    if (!success) {
      setUsers(users.map(u =>
        u.id === id ? { ...u, verified: !u.verified } : u
      ));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleCertificatesDropdown = (userId: number) => {
    setOpenCertificates(prevState => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  const togglePortfoliosDropdown = (userId: number) => {
    setOpenPortfolios(prevState => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  return (
    <div className="flex bg-white">
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-black mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="border border-gray-300 p-2 text-black">#</th>
                    <th className="border border-gray-300 p-2 text-black">Name</th>
                    <th className="border border-gray-300 p-2 text-black">Email</th>
                    <th className="border border-gray-300 p-2 text-black">Role</th>
                    <th className="border border-gray-300 p-2 text-black">Verified</th>
                    <th className="border border-gray-300 p-2 text-black">Certificates</th>
                    <th className="border border-gray-300 p-2 text-black">Portfolios</th>
                    <th className="border border-gray-300 p-2 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-300">
                      <td className="border border-gray-300 p-2 text-black">{index + 1}</td>
                      <td className="border border-gray-300 p-2 text-black">{user.username}</td>
                      <td className="border border-gray-300 p-2 text-black">{user.email}</td>
                      <td className="border border-gray-300 p-2 text-black">{user.role.rolename}</td>
                      <td className="border border-gray-300 p-2 text-black">{user.verified ? 'Yes' : 'No'}</td>
                      <td className="border border-gray-300 p-2 text-black">
                        <button
                          onClick={() => toggleCertificatesDropdown(user.id)}
                          className="text-blue-500 underline"
                        >
                          {openCertificates[user.id] ? 'Hide Certificates' : 'Show Certificates'}
                        </button>
                        {openCertificates[user.id] && (
                          <div className="mt-2 pl-4">
                            {user.certificates && user.certificates.length > 0 ? (
                              user.certificates.map(cert => (
                                <a
                                  key={cert.id}
                                  href={`https://custme.site/storage/app/public/${cert.file_path}`}
                                  download
                                  className="text-blue-500 underline"
                                >
                                  {cert.file_name}
                                </a>
                              ))
                            ) : (
                              'No Certificates'
                            )}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-black">
                        <button
                          onClick={() => togglePortfoliosDropdown(user.id)}
                          className="text-blue-500 underline"
                        >
                          {openPortfolios[user.id] ? 'Hide Portfolios' : 'Show Portfolios'}
                        </button>
                        {openPortfolios[user.id] && (
                          <div className="mt-2 pl-4">
                            {user.portfolios && user.portfolios.length > 0 ? (
                              user.portfolios.map(portfolio => (
                                <a
                                  key={portfolio.id}
                                  href={`https://custme.site/storage/app/public/${portfolio.file_path}`}
                                  download
                                  className="text-blue-500 underline"
                                >
                                  {portfolio.file_name}
                                </a>
                              ))
                            ) : (
                              'No Portfolios'
                            )}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-black">
                        <button
                          className={`btn btn-neutral ${user.verified ? 'bg-green-500' : 'bg-red-500'}`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.verified ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <button
                  className="btn bg-success"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="text-black">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn bg-success"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListForm;
