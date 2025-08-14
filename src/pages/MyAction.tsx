// import React, { useState, useEffect } from 'react';
// import { FiSearch, FiEye, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { format } from 'date-fns';

// interface ActionItem {
//   id: string;
//   requestId: string;
//   jobDescription: string;
//   requestedBy: string;
//   requestDate: string;
//   status: 'pending' | 'completed';
//   itemsRequested: number;
//   itemsProvided?: number;
//   remarks?: string;
//   dueDate: string;
// }

// // Mock data
// const mockActions: ActionItem[] = [
//   {
//     id: '1',
//     requestId: 'REQ-2024-001',
//     jobDescription: 'Steel beam installation at Site A',
//     requestedBy: 'John Doe',
//     requestDate: '2024-01-15T10:30:00',
//     status: 'pending',
//     itemsRequested: 10,
//     dueDate: '2024-01-20T17:00:00',
//   },
//   {
//     id: '2',
//     requestId: 'REQ-2024-002',
//     jobDescription: 'Crane operation for tower construction',
//     requestedBy: 'Jane Smith',
//     requestDate: '2024-01-14T14:15:00',
//     status: 'pending',
//     itemsRequested: 2,
//     dueDate: '2024-01-18T12:00:00',
//   },
//   {
//     id: '3',
//     requestId: 'REQ-2024-003',
//     jobDescription: 'Scaffolding setup for maintenance work',
//     requestedBy: 'Mike Johnson',
//     requestDate: '2024-01-13T09:00:00',
//     status: 'completed',
//     itemsRequested: 50,
//     itemsProvided: 45,
//     remarks: 'Partial delivery due to inventory shortage',
//     dueDate: '2024-01-16T16:00:00',
//   },
// ];

// const MyAction: React.FC = () => {
//   const [actions, setActions] = useState<ActionItem[]>([]);
//   const [filteredActions, setFilteredActions] = useState<ActionItem[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [actionForm, setActionForm] = useState({
//     itemsProvided: 0,
//     remarks: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchMyActions();
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredActions(actions);
//     } else {
//       setFilteredActions(
//         actions.filter((action) =>
//           action.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           action.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           action.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
//   }, [searchTerm, actions]);

//   const fetchMyActions = async () => {
//     try {
//       setIsLoading(true);
//       // Mock API call - replace with actual API
//       // const response = await axios.get('/api/request/my-actions');
//       // setActions(response.data);
      
//       // Using mock data for now
//       setTimeout(() => {
//         setActions(mockActions);
//         setIsLoading(false);
//       }, 1000);
//     } catch (error) {
//       console.error('Failed to fetch actions:', error);
//       toast.error('Failed to load actions');
//       setIsLoading(false);
//     }
//   };

//   const openActionModal = (action: ActionItem) => {
//     setSelectedAction(action);
//     setActionForm({
//       itemsProvided: action.itemsProvided || 0,
//       remarks: action.remarks || '',
//     });
//     setIsModalOpen(true);
//   };

//   const closeActionModal = () => {
//     setIsModalOpen(false);
//     setSelectedAction(null);
//     setActionForm({ itemsProvided: 0, remarks: '' });
//   };

//   const handleSubmitAction = async () => {
//     if (!selectedAction) return;

//     if (actionForm.itemsProvided > selectedAction.itemsRequested) {
//       toast.error('Items provided cannot exceed items requested');
//       return;
//     }

//     if (actionForm.itemsProvided <= 0) {
//       toast.error('Please enter a valid number of items provided');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await axios.post('/api/request/action-submit', {
//         requestId: selectedAction.requestId,
//         itemsProvided: actionForm.itemsProvided,
//         remarks: actionForm.remarks,
//       });

//       // Update local state
//       setActions(prev =>
//         prev.map(action =>
//           action.id === selectedAction.id
//             ? {
//                 ...action,
//                 status: 'completed' as const,
//                 itemsProvided: actionForm.itemsProvided,
//                 remarks: actionForm.remarks,
//               }
//             : action
//         )
//       );

//       toast.success('Action submitted successfully!');
//       closeActionModal();
//     } catch (error) {
//       console.error('Submit action failed:', error);
//       toast.error('Failed to submit action. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStatusBadge = (status: ActionItem['status']) => {
//     switch (status) {
//       case 'pending':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
//             <FiClock className="mr-1 h-3 w-3" />
//             Pending
//           </span>
//         );
//       case 'completed':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
//             <FiCheckCircle className="mr-1 h-3 w-3" />
//             Completed
//           </span>
//         );
//     }
//   };

//   const isOverdue = (dueDate: string) => {
//     return new Date(dueDate) < new Date();
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             My Actions
//           </h1>
          
//           <div className="mt-4 sm:mt-0 flex-1 max-w-md sm:ml-6">
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search by Request ID, description, or requester..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {filteredActions.length === 0 ? (
//           <div className="text-center py-12">
//             <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               {searchTerm ? 'No matching actions found' : 'No pending actions'}
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400">
//               {searchTerm 
//                 ? 'Try adjusting your search terms' 
//                 : 'All your assigned actions have been completed'}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Request Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Requested By
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Items
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Due Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {filteredActions.map((action) => (
//                   <tr 
//                     key={action.id} 
//                     className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
//                       action.status === 'pending' && isOverdue(action.dueDate) 
//                         ? 'bg-red-50 dark:bg-red-900/10' 
//                         : ''
//                     }`}
//                   >
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900 dark:text-white">
//                           {action.requestId}
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
//                           {action.jobDescription}
//                         </div>
//                         <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
//                           Requested: {format(new Date(action.requestDate), 'MMM dd, yyyy HH:mm')}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
//                       {action.requestedBy}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 dark:text-white">
//                         {action.status === 'completed' && action.itemsProvided !== undefined
//                           ? `${action.itemsProvided} / ${action.itemsRequested}`
//                           : action.itemsRequested
//                         }
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         {action.status === 'completed' ? 'Provided / Requested' : 'Requested'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className={`text-sm ${
//                         action.status === 'pending' && isOverdue(action.dueDate)
//                           ? 'text-red-600 dark:text-red-400 font-medium'
//                           : 'text-gray-900 dark:text-white'
//                       }`}>
//                         {format(new Date(action.dueDate), 'MMM dd, yyyy')}
//                       </div>
//                       <div className={`text-xs ${
//                         action.status === 'pending' && isOverdue(action.dueDate)
//                           ? 'text-red-500 dark:text-red-400'
//                           : 'text-gray-500 dark:text-gray-400'
//                       }`}>
//                         {format(new Date(action.dueDate), 'HH:mm')}
//                         {action.status === 'pending' && isOverdue(action.dueDate) && ' (Overdue)'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       {getStatusBadge(action.status)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => openActionModal(action)}
//                           className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded-md transition-colors"
//                           title="View details"
//                         >
//                           <FiEye className="h-4 w-4" />
//                         </button>
//                         {action.status === 'pending' && (
//                           <button
//                             onClick={() => openActionModal(action)}
//                             className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
//                           >
//                             <FiSend className="h-3 w-3 mr-1" />
//                             Action
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Action Modal */}
//       {isModalOpen && selectedAction && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeActionModal} />
            
//             <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
//               <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
//                     <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
//                       Request Details - {selectedAction.requestId}
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                           Job Description
//                         </label>
//                         <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
//                           {selectedAction.jobDescription}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Requested By
//                           </label>
//                           <p className="text-sm text-gray-900 dark:text-white">
//                             {selectedAction.requestedBy}
//                           </p>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Items Requested
//                           </label>
//                           <p className="text-sm text-gray-900 dark:text-white">
//                             {selectedAction.itemsRequested}
//                           </p>
//                         </div>
//                       </div>

//                       {selectedAction.status === 'pending' ? (
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Items You Can Provide *
//                             </label>
//                             <input
//                               type="number"
//                               min="0"
//                               max={selectedAction.itemsRequested}
//                               value={actionForm.itemsProvided}
//                               onChange={(e) =>
//                                 setActionForm(prev => ({
//                                   ...prev,
//                                   itemsProvided: parseInt(e.target.value) || 0,
//                                 }))
//                               }
//                               className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                             />
//                           </div>
                          
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                               Remarks
//                             </label>
//                             <textarea
//                               value={actionForm.remarks}
//                               onChange={(e) =>
//                                 setActionForm(prev => ({
//                                   ...prev,
//                                   remarks: e.target.value,
//                                 }))
//                               }
//                               rows={3}
//                               className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                               placeholder="Enter any remarks or reasons for partial fulfillment"
//                             />
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                 Items Provided
//                               </label>
//                               <p className="text-sm text-gray-900 dark:text-white">
//                                 {selectedAction.itemsProvided}
//                               </p>
//                             </div>
//                           </div>
                          
//                           {selectedAction.remarks && (
//                             <div>
//                               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                 Remarks
//                               </label>
//                               <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
//                                 {selectedAction.remarks}
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                 {selectedAction.status === 'pending' ? (
//                   <>
//                     <button
//                       type="button"
//                       onClick={handleSubmitAction}
//                       disabled={isSubmitting}
//                       className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
//                     >
//                       {isSubmitting ? 'Submitting...' : 'Submit Action'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={closeActionModal}
//                       disabled={isSubmitting}
//                       className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={closeActionModal}
//                     className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
//                   >
//                     Close
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyAction;

import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiSend, FiClock, FiUser, FiCalendar, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyActionsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionData, setActionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('L1'); // Mock role - will come from API

  // Mock data with complete approval workflow
  useEffect(() => {
    const mockRequests = [
      {
        id: 'REQ-001234',
        mainForm: {
          jobDescription: 'Steel beam installation',
          jobStartDate: '2024-01-20',
          location: 'Plant A',
          requesterName: 'Jane Smith',
          requesterId: 'EMP001',
          requesterDept: 'Engineering',
          requesterComment: 'Urgent requirement for construction project'
        },
        requestDate: '2024-01-15',
        status: 'Pending L1 Action',
        priority: 'High',
        subtasks: [
          {
            id: 'S1',
            type: 'Scaffolding',
            subType: 'Supported Scaffolding',
            quantityItem: '100 sq meters',
            providerLocation: 'Location A',
            vendor: 'Scaffolding Co. A',
            requestedQty: 100,
            assignedTo: ['L1'],
            l1Data: null,
            l2Data: null,
            l3Data: null,
            l4Data: null
          },
          {
            id: 'S2',
            type: 'Crane',
            subType: 'Mobile Crane',
            quantityItem: '1 unit - 50 ton capacity',
            providerLocation: 'Location B',
            vendor: 'Crane Services Inc.',
            requestedQty: 1,
            assignedTo: ['L1'],
            l1Data: null,
            l2Data: null,
            l3Data: null,
            l4Data: null
          }
        ]
      },
      {
        id: 'REQ-001235',
        mainForm: {
          jobDescription: 'Maintenance Work',
          jobStartDate: '2024-01-18',
          location: 'Plant B',
          requesterName: 'Mike Johnson',
          requesterId: 'EMP002',
          requesterDept: 'Operations',
          requesterComment: 'Routine maintenance activity'
        },
        requestDate: '2024-01-14',
        status: 'Pending L2 Action',
        priority: 'Medium',
        subtasks: [
          {
            id: 'S3',
            type: 'Manpower',
            subType: 'Skilled Labor',
            quantityItem: '5 welders',
            providerLocation: 'Location C',
            vendor: 'Labor Solutions Pvt Ltd',
            skill: 'Welding',
            subSkill: 'Arc Welding',
            requestedQty: 5,
            assignedTo: ['L1', 'L2'],
            l1Data: {
              amount: 4,
              remarks: 'Can provide 4 welders, 1 not available',
              submittedBy: 'John Doe',
              submittedDate: '2024-01-15'
            },
            l2Data: null,
            l3Data: null,
            l4Data: null
          }
        ]
      },
      {
        id: 'REQ-001236',
        mainForm: {
          jobDescription: 'Construction',
          jobStartDate: '2024-01-22',
          location: 'Plant C',
          requesterName: 'Sarah Davis',
          requesterId: 'EMP003',
          requesterDept: 'Safety',
          requesterComment: 'Safety equipment installation'
        },
        requestDate: '2024-01-13',
        status: 'Pending L3 Action',
        priority: 'Low',
        subtasks: [
          {
            id: 'S4',
            type: 'Rope Access',
            subType: 'Industrial Rope Access',
            quantityItem: '2 teams',
            providerLocation: 'Location D',
            vendor: 'Rope Access Ltd.',
            requestedQty: 2,
            assignedTo: ['L1', 'L2', 'L3'],
            l1Data: {
              amount: 2,
              remarks: 'Both teams available',
              submittedBy: 'Alice Brown',
              submittedDate: '2024-01-14'
            },
            l2Data: {
              qtyToTake: 2,
              remarks: 'Approved full quantity',
              submittedBy: 'Bob Wilson',
              submittedDate: '2024-01-15'
            },
            l3Data: null,
            l4Data: null
          }
        ]
      }
    ];

    // Filter requests based on user role
    const filteredByRole = mockRequests.filter(request => {
      return request.subtasks.some(subtask => subtask.assignedTo.includes(userRole));
    });

    setRequests(filteredByRole);
    setFilteredRequests(filteredByRole);
  }, [userRole]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = requests.filter(request =>
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.mainForm.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.mainForm.requesterName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchTerm, requests]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleActionChange = (subtaskId, field, value) => {
    setActionData(prev => ({
      ...prev,
      [`${subtaskId}-${field}`]: value
    }));
  };

  const handleSubmitAction = async (requestId) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update request status based on role
      setRequests(prev => prev.map(req => {
        if (req.id === requestId) {
          const updatedSubtasks = req.subtasks.map(subtask => {
            if (subtask.assignedTo.includes(userRole)) {
              const newData = {
                submittedBy: 'Current User',
                submittedDate: new Date().toISOString().split('T')[0]
              };

              if (userRole === 'L1') {
                newData.amount = actionData[`${subtask.id}-amount`] || 0;
                newData.remarks = actionData[`${subtask.id}-remarks`] || '';
                return { ...subtask, l1Data: newData };
              } else if (userRole === 'L2') {
                newData.qtyToTake = actionData[`${subtask.id}-qtyToTake`] || 0;
                newData.remarks = actionData[`${subtask.id}-remarks`] || '';
                return { ...subtask, l2Data: newData };
              } else if (userRole === 'L3') {
                newData.actualQty = actionData[`${subtask.id}-actualQty`] || 0;
                newData.remarks = actionData[`${subtask.id}-remarks`] || '';
                return { ...subtask, l3Data: newData };
              }
            }
            return subtask;
          });

          return {
            ...req,
            subtasks: updatedSubtasks,
            status: `${userRole} Action Completed`
          };
        }
        return req;
      }));
      
      toast.success('Action submitted successfully!', { position: "bottom-right" });
      setSelectedRequest(null);
      setActionData({});
      
    } catch (error) {
      toast.error('Failed to submit action. Please try again.', { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Pending')) return 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900/20';
    if (status.includes('Completed')) return 'text-green-800 bg-green-100 dark:bg-green-900/20';
    return 'text-blue-800 bg-blue-100 dark:bg-blue-900/20';
  };

  const renderApprovalForm = (subtask) => {
    const isAssigned = subtask.assignedTo.includes(userRole);
    if (!isAssigned) return null;

    return (
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">
          {userRole} Action Required
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userRole === 'L1' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Provide *
                </label>
                <input
                  type="number"
                  min="0"
                  max={subtask.requestedQty}
                  value={actionData[`${subtask.id}-amount`] || ''}
                  onChange={(e) => handleActionChange(subtask.id, 'amount', e.target.value)}
                  className="w-full border border-gray-300 dark:border-secondary-600 rounded px-3 py-2 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={`Max: ${subtask.requestedQty}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={actionData[`${subtask.id}-remarks`] || ''}
                  onChange={(e) => handleActionChange(subtask.id, 'remarks', e.target.value)}
                  className="w-full border border-gray-300 dark:border-secondary-600 rounded px-3 py-2 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add your remarks..."
                  rows="2"
                />
              </div>
            </>
          )}

          {userRole === 'L2' && subtask.l1Data && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity to Take *
                </label>
                <input
                  type="number"
                  min="0"
                  max={Math.min(subtask.l1Data.amount, subtask.requestedQty)}
                  value={actionData[`${subtask.id}-qtyToTake`] || ''}
                  onChange={(e) => handleActionChange(subtask.id, 'qtyToTake', e.target.value)}
                  className="w-full border border-gray-300 dark:border-secondary-600 rounded px-3 py-2 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={`Max: ${Math.min(subtask.l1Data.amount, subtask.requestedQty)}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments
                </label>
                <textarea
                  value={actionData[`${subtask.id}-remarks`] || ''}
                  onChange={(e) => handleActionChange(subtask.id, 'remarks', e.target.value)}
                  className="w-full border border-gray-300 dark:border-secondary-600 rounded px-3 py-2 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add your comments..."
                  rows="2"
                />
              </div>
            </>
          )}

          {userRole === 'L3' && subtask.l2Data && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Actual Quantity Received *
                </label>
                <input
                  type="number"
                  min="0"
                  value={actionData[`${subtask.id}-actualQty`] || ''}
                  onChange={(e) => handleActionChange(subtask.id, 'actualQty', e.target.value)}
                  className="w-full border border-gray-300 dark:border-secondary-600 rounded px-3 py-2 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter actual quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={actionData[`${subtask.id}-remarks`] || ''}
                  onChange={(e) => handleActionChange(subtask.id, 'remarks', e.target.value)}
                  className="w-full border border-gray-300 dark:border-secondary-600 rounded px-3 py-2 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add your remarks..."
                  rows="2"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderApprovalHistory = (subtask) => {
    const history = [];
    
    if (subtask.l1Data) {
      history.push({
        level: 'L1',
        data: subtask.l1Data,
        title: 'First Level Approval'
      });
    }
    
    if (subtask.l2Data) {
      history.push({
        level: 'L2',
        data: subtask.l2Data,
        title: 'Second Level Approval'
      });
    }
    
    if (subtask.l3Data) {
      history.push({
        level: 'L3',
        data: subtask.l3Data,
        title: 'Post-Work Actuals'
      });
    }

    if (history.length === 0) return null;

    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Approval History</h4>
        <div className="space-y-3">
          {history.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-secondary-700 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm text-primary-600 dark:text-primary-400">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.data.submittedDate}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {item.level === 'L1' && (
                  <>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Amount Provided:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.data.amount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Submitted By:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.data.submittedBy}
                      </span>
                    </div>
                  </>
                )}
                {item.level === 'L2' && (
                  <>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Quantity Taken:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.data.qtyToTake}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Approved By:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.data.submittedBy}
                      </span>
                    </div>
                  </>
                )}
                {item.level === 'L3' && (
                  <>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Actual Received:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.data.actualQty}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Verified By:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.data.submittedBy}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {item.data.remarks && (
                <div className="mt-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Remarks:</span>
                  <p className="text-gray-900 dark:text-white text-sm mt-1">
                    {item.data.remarks}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RequestDetailsModal = ({ request, onClose }) => {
    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-secondary-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Request Details - {request.id}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current Role: {userRole} | Status: {request.status}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Main Request Information */}
            <div className="bg-gray-50 dark:bg-secondary-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiUser className="w-5 h-5 mr-2" />
                Main Request Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <FiUser className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Requester</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.mainForm.requesterName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Job Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.mainForm.jobStartDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {request.mainForm.location}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Job Description</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {request.mainForm.jobDescription}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {request.mainForm.requesterDept}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
              </div>
              {request.mainForm.requesterComment && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {request.mainForm.requesterComment}
                  </p>
                </div>
              )}
            </div>

            {/* Subtasks */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Subtasks ({request.subtasks.length})
              </h3>
              
              <div className="space-y-4">
                {request.subtasks.map((subtask) => (
                  <div key={subtask.id} className="border border-gray-200 dark:border-secondary-600 rounded-lg">
                    <div className="bg-gray-50 dark:bg-secondary-700 px-4 py-3 border-b border-gray-200 dark:border-secondary-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {subtask.type} - {subtask.subType}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Requested: {subtask.quantityItem} | Vendor: {subtask.vendor}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {subtask.assignedTo.includes(userRole) && (
                            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                              Assigned to You
                            </span>
                          )}
                          <span className="bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                            ID: {subtask.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {/* Subtask Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Requested Quantity:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {subtask.requestedQty}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Provider Location:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {subtask.providerLocation}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Assigned To:</span>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {subtask.assignedTo.join(', ')}
                          </p>
                        </div>
                      </div>

                      {/* Approval History */}
                      {renderApprovalHistory(subtask)}

                      {/* Action Form */}
                      {renderApprovalForm(subtask)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-secondary-700">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitAction(request.id)}
                disabled={loading}
                className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    <span>Submit {userRole} Action</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Actions ({userRole})
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and respond to resource requests assigned to you
        </p>
      </div>

      {/* Role Selector (for demo purposes) */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Role (Demo):
          </label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="border border-gray-300 dark:border-secondary-600 rounded px-3 py-1 text-sm bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
          >
            <option value="L1">L1 - First Level Approval</option>
            <option value="L2">L2 - Second Level Approval</option>
            <option value="L3">L3 - Post-Work Actuals</option>
            <option value="L4">L4 - Extended Role</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Request ID, Job Description, or Requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-secondary-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Job Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subtasks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-secondary-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-secondary-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {request.mainForm.jobDescription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{request.mainForm.requesterName}</div>
                      <div className="text-gray-500 dark:text-gray-400">{request.mainForm.requesterDept}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-1">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {request.subtasks.length} total
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        {request.subtasks.filter(s => s.assignedTo.includes(userRole)).length} assigned
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium flex items-center space-x-1"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No requests found matching your search.' : `No requests assigned to ${userRole} role.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default MyActionsPage;
