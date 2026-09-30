const Notification = require('../models/Notification');

/**
 * Creates and saves an in-app notification for a user
 */
const createNotification = async ({ userId, title, message, type = 'info', link = '' }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
    });
    return notification;
  } catch (error) {
    console.error('[NotificationService] Error creating notification:', error.message);
    return null;
  }
};

/**
 * Creates notification for application status change
 */
const notifyStatusChange = async (application, newStatus, remarks = '') => {
  if (!application || !application.user) return;

  let title = 'Application Status Updated';
  let message = `Your application ${application.applicationId} status is now: ${newStatus}.`;
  let type = 'info';

  if (newStatus === 'Approved') {
    title = 'Application Approved! 🎉';
    message = `Congratulations! Your application ${application.applicationId} has been approved.`;
    type = 'success';
  } else if (newStatus === 'Rejected') {
    title = 'Application Update: Rejected';
    message = `Your application ${application.applicationId} was not approved.${remarks ? ' Reason: ' + remarks : ''}`;
    type = 'error';
  } else if (newStatus === 'Additional Information Required') {
    title = 'Action Required: Additional Info Needed';
    message = `The department has requested additional details for application ${application.applicationId}.${remarks ? ' Remarks: ' + remarks : ''}`;
    type = 'warning';
  } else if (newStatus === 'Completed') {
    title = 'Service Delivery Completed';
    message = `Your service for application ${application.applicationId} has been completed.`;
    type = 'success';
  }

  const userId = application.user._id || application.user;
  return await createNotification({
    userId,
    title,
    message,
    type,
    link: `/applications/${application.applicationId}`,
  });
};

module.exports = {
  createNotification,
  notifyStatusChange,
};
