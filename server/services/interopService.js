const ApiLog = require('../models/ApiLog');

/**
 * Simulated Government Department REST API Gateway
 * Demonstrates interoperability between MahaConnect and Departmental systems:
 * - Transport Department API (Sarathi / Vahan integration)
 * - Revenue Department API (MahaBhulekh / Tehsil e-District)
 * - Education Department API (MahaDBT State Portal)
 * - Municipal Corporation API (Urban Local Bodies Registry)
 * - Employment Department API (MahaSwayam Employment Portal)
 * - Social Welfare & Health Department APIs
 */
class InteropGatewayService {
  /**
   * Helper to simulate network latency between gateways (30ms - 95ms)
   */
  async simulateNetworkDelay(minMs = 35, maxMs = 95) {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return delay;
  }

  /**
   * Get department destination API configuration based on department code/name
   */
  getDepartmentConfig(department) {
    const code = (department.code || '').toUpperCase();
    const name = department.name || 'Department System';

    switch (code) {
      case 'TRANS':
        return {
          system: 'Transport Department (Vahan/Sarathi API)',
          baseEndpoint: '/v1/transport/applications',
          prefix: 'MH-MVD',
        };
      case 'REV':
        return {
          system: 'Revenue & Land Records API (e-District)',
          baseEndpoint: '/v1/revenue/certificates',
          prefix: 'MH-REV',
        };
      case 'EDU':
        return {
          system: 'Higher & Technical Education API (MahaDBT)',
          baseEndpoint: '/v1/education/scholarships',
          prefix: 'MH-EDU',
        };
      case 'MUNI':
        return {
          system: 'Urban Local Bodies Civil Registry API',
          baseEndpoint: '/v1/municipal/registry',
          prefix: 'MH-MCGM',
        };
      case 'EMP':
        return {
          system: 'Skill Development & Employment API (MahaSwayam)',
          baseEndpoint: '/v1/employment/candidate',
          prefix: 'MH-ROJ',
        };
      case 'SOC':
        return {
          system: 'Social Justice & Special Assistance API',
          baseEndpoint: '/v1/welfare/schemes',
          prefix: 'MH-SJC',
        };
      case 'HLTH':
        return {
          system: 'Public Health Department API (Arogya Portal)',
          baseEndpoint: '/v1/health/services',
          prefix: 'MH-HLT',
        };
      default:
        return {
          system: `${name} API`,
          baseEndpoint: `/v1/dept/${code.toLowerCase() || 'general'}/applications`,
          prefix: `MH-${code || 'GOV'}`,
        };
    }
  }

  /**
   * Dispatch a newly submitted citizen application to the target Department's REST API
   */
  async dispatchApplicationSubmission(application, department, service) {
    const config = this.getDepartmentConfig(department);
    const latency = await this.simulateNetworkDelay(40, 110);
    const refNum = `${config.prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const requestPayload = {
      mahaConnectAppId: application.applicationId,
      serviceCode: service.code,
      serviceName: service.name,
      citizen: {
        name: application.formData?.personalInfo?.fullName || 'Citizen',
        email: application.formData?.personalInfo?.email,
        mobile: application.formData?.personalInfo?.mobile,
      },
      submittedAt: new Date().toISOString(),
      documentsCount: application.documents?.length || 0,
    };

    const responsePayload = {
      status: 'ACKNOWLEDGED',
      departmentReferenceId: refNum,
      routingQueue: `${department.code || 'GOV'}_PROCESSING_QUEUE_1`,
      estimatedSlaDays: service.processingTime || '7 Working Days',
      interopProtocol: 'REST/JSON over mTLS',
    };

    // Record the API Interoperability Log
    try {
      await ApiLog.create({
        source: 'MahaConnect Gateway',
        destination: config.system,
        endpoint: config.baseEndpoint,
        method: 'POST',
        statusCode: 201,
        responseTime: latency,
        status: 'SUCCESS',
        requestPayload,
        responsePayload,
        applicationId: application.applicationId,
        timestamp: new Date(),
      });
    } catch (logErr) {
      console.error('[InteropGateway] Failed to record API log:', logErr.message);
    }

    return {
      success: true,
      departmentReferenceId: refNum,
      responseTime: latency,
    };
  }

  /**
   * Sync an application status update / officer remark with the department system
   */
  async dispatchStatusUpdate(application, department, newStatus, remarks, officerName) {
    const config = this.getDepartmentConfig(department);
    const latency = await this.simulateNetworkDelay(30, 85);

    const requestPayload = {
      applicationId: application.applicationId,
      departmentReferenceId: application.interopReferenceId || `${config.prefix}-SYNC`,
      newStatus,
      updatedBy: officerName || 'Department Officer',
      officerRemarks: remarks,
      syncTimestamp: new Date().toISOString(),
    };

    const responsePayload = {
      synced: true,
      stateRecordUpdated: true,
      departmentAuditId: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      status: newStatus,
    };

    try {
      await ApiLog.create({
        source: 'MahaConnect Gateway',
        destination: config.system,
        endpoint: `${config.baseEndpoint}/${application.applicationId}/status`,
        method: 'PATCH',
        statusCode: 200,
        responseTime: latency,
        status: 'SUCCESS',
        requestPayload,
        responsePayload,
        applicationId: application.applicationId,
        timestamp: new Date(),
      });
    } catch (logErr) {
      console.error('[InteropGateway] Failed to record API log:', logErr.message);
    }

    return {
      success: true,
      responseTime: latency,
    };
  }

  /**
   * Simulated Aadhaar / Identity Verification Gateway Call
   */
  async verifyCitizenIdentity(aadhaarNumber, citizenName) {
    const latency = await this.simulateNetworkDelay(50, 120);

    const isSuccess = Boolean(aadhaarNumber && aadhaarNumber.length >= 12);

    const logEntry = {
      source: 'MahaConnect Gateway',
      destination: 'UIDAI Aadhaar e-KYC Verification API',
      endpoint: '/v2.5/identity/verify',
      method: 'POST',
      statusCode: isSuccess ? 200 : 400,
      responseTime: latency,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      requestPayload: {
        maskedAadhaar: aadhaarNumber ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}` : 'UNKNOWN',
        citizenName,
        consentProvided: true,
      },
      responsePayload: {
        verified: isSuccess,
        authCode: isSuccess ? `AUTH-${Math.floor(100000 + Math.random() * 900000)}` : null,
        message: isSuccess ? 'Demographic details matched' : 'Invalid identifier format',
      },
      timestamp: new Date(),
    };

    try {
      await ApiLog.create(logEntry);
    } catch (e) {
      console.error('[InteropGateway] Log error:', e.message);
    }

    return {
      verified: isSuccess,
      responseTime: latency,
    };
  }
}

module.exports = new InteropGatewayService();
