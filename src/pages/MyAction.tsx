import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns';

interface ActionItem {
  id: string;
  requestId: string;
  jobDescription: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'completed';
  itemsRequested: number;
  itemsProvided?: number;
  remarks?: string;
  dueDate: string;
}

// Mock data
const mockActions: ActionItem[] = [
  {
    id: '1',
    requestId: 'REQ-2024-001',
    jobDescription: 'Steel beam installation at Site A',
    requestedBy: 'John Doe',
    requestDate: '2024-01-15T10:30:00',
    status: 'pending',
    itemsRequested: 10,
    dueDate: '2024-01-20T17:00:00',
  },
  {
    id: '2',
    requestId: 'REQ-2024-002',
    jobDescription: 'Crane operation for tower construction',
    requestedBy: 'Jane Smith',
    requestDate: '2024-01-14T14:15:00',
    status: 'pending',
    itemsRequested: 2,
    dueDate: '2024-01-18T12:00:00',
  },
  {
    id: '3',
    requestId: 'REQ-2024-003',
    jobDescription: 'Scaffolding setup for maintenance work',
    requestedBy: 'Mike Johnson',
    requestDate: '2024-01-13T09:00:00',
    status: 'completed',
    itemsRequested: 50,
    itemsProvided: 45,
    remarks: 'Partial delivery due to inventory shortage',
    dueDate: '2024-01-16T16:00:00',
  },
];

const MyAction: React.FC = () => {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [filteredActions, setFilteredActions] = useState<ActionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionForm, setActionForm] = useState({
    itemsProvided: 0,
    remarks: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyActions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredActions(actions);
    } else {
      setFilteredActions(
        actions.filter((action) =>
          action.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, actions]);

  const fetchMyActions = async () => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      // const response = await axios.get('/api/request/my-actions');
      // setActions(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setActions(mockActions);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch actions:', error);
      toast.error('Failed to load actions');
      setIsLoading(false);
    }
  };

  const openActionModal = (action: ActionItem) => {
    setSelectedAction(action);
    setActionForm({
      itemsProvided: action.itemsProvided || 0,
      remarks: action.remarks || '',
    });
    setIsModalOpen(true);
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
    setSelectedAction(null);
    setActionForm({ itemsProvided: 0, remarks: '' });
  };

  const handleSubmitAction = async () => {
    if (!selectedAction) return;

    if (actionForm.itemsProvided > selectedAction.itemsRequested) {
      toast.error('Items provided cannot exceed items requested');
      return;
    }

    if (actionForm.itemsProvided <= 0) {
      toast.error('Please enter a valid number of items provided');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/request/action-submit', {
        requestId: selectedAction.requestId,
        itemsProvided: actionForm.itemsProvided,
        remarks: actionForm.remarks,
      });

      // Update local state
      setActions(prev =>
        prev.map(action =>
          action.id === selectedAction.id
            ? {
                ...action,
                status: 'completed' as const,
                itemsProvided: actionForm.itemsProvided,
                remarks: actionForm.remarks,
              }
            : action
        )
      );

      toast.success('Action submitted successfully!');
      closeActionModal();
    } catch (error) {
      console.error('Submit action failed:', error);
      toast.error('Failed to submit action. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ActionItem['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
            <FiClock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Actions
          </h1>
          
          <div className="mt-4 sm:mt-0 flex-1 max-w-md sm:ml-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Request ID, description, or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        {filteredActions.length === 0 ? (
          <div className="text-center py-12">
            <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No matching actions found' : 'No pending actions'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'All your assigned actions have been completed'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredActions.map((action) => (
                  <tr 
                    key={action.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      action.status === 'pending' && isOverdue(action.dueDate) 
                        ? 'bg-red-50 dark:bg-red-900/10' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {action.requestId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {action.jobDescription}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Requested: {format(new Date(action.requestDate), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {action.requestedBy}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {action.status === 'completed' && action.itemsProvided !== undefined
                          ? `${action.itemsProvided} / ${action.itemsRequested}`
                          : action.itemsRequested
                        }
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {action.status === 'completed' ? 'Provided / Requested' : 'Requested'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${
                        action.status === 'pending' && isOverdue(action.dueDate)
                          ? 'text-red-600 dark:text-red-400 font-medium'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {format(new Date(action.dueDate), 'MMM dd, yyyy')}
                      </div>
                      <div className={`text-xs ${
                        action.status === 'pending' && isOverdue(action.dueDate)
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {format(new Date(action.dueDate), 'HH:mm')}
                        {action.status === 'pending' && isOverdue(action.dueDate) && ' (Overdue)'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(action.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openActionModal(action)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded-md transition-colors"
                          title="View details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        {action.status === 'pending' && (
                          <button
                            onClick={() => openActionModal(action)}
                            className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          >
                            <FiSend className="h-3 w-3 mr-1" />
                            Action
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {isModalOpen && selectedAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeActionModal} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                      Request Details - {selectedAction.requestId}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Description
                        </label>
                        <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                          {selectedAction.jobDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Requested By
                          </label>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {selectedAction.requestedBy}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Items Requested
                          </label>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {selectedAction.itemsRequested}
                          </p>
                        </div>
                      </div>

                      {selectedAction.status === 'pending' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Items You Can Provide *
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={selectedAction.itemsRequested}
                              value={actionForm.itemsProvided}
                              onChange={(e) =>
                                setActionForm(prev => ({
                                  ...prev,
                                  itemsProvided: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Remarks
                            </label>
                            <textarea
                              value={actionForm.remarks}
                              onChange={(e) =>
                                setActionForm(prev => ({
                                  ...prev,
                                  remarks: e.target.value,
                                }))
                              }
                              rows={3}
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Enter any remarks or reasons for partial fulfillment"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Items Provided
                              </label>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {selectedAction.itemsProvided}
                              </p>
                            </div>
                          </div>
                          
                          {selectedAction.remarks && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Remarks
                              </label>
                              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                {selectedAction.remarks}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {selectedAction.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleSubmitAction}
                      disabled={isSubmitting}
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Action'}
                    </button>
                    <button
                      type="button"
                      onClick={closeActionModal}
                      disabled={isSubmitting}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={closeActionModal}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAction;