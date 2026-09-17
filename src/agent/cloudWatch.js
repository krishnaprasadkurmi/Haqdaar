/**
 * CloudWatch Log Stream & Metrics Simulation for AWS Proof
 * Provides real-time JSON log entries, AWS Request IDs, and Bedrock invocation metrics.
 */

class CloudWatchLogger {
  constructor() {
    this.logs = [];
    this.listeners = new Set();
    this.sessionStartTime = new Date().toISOString();
    
    // Seed initial startup logs
    this.log('INFO', 'INIT_START', {
      message: 'HaqDaar Agent Runtime initialized in ap-south-1 (Mumbai)',
      version: '1.0.0-prod',
      environment: 'AWS Lambda + Bedrock Agents SDK',
      region: 'ap-south-1'
    });
    this.log('INFO', 'DYNAMODB_SYNC', {
      tables: ['haqdaar-hospitals', 'haqdaar-schemes'],
      status: 'ACTIVE',
      itemCount: { 'haqdaar-hospitals': 12, 'haqdaar-schemes': 3 }
    });
  }

  generateRequestId() {
    return 'req-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
  }

  log(level, eventType, payload = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      eventType,
      requestId: payload.requestId || this.generateRequestId(),
      service: 'haqdaar-bedrock-agent',
      logStream: `2026/09/17/[$LATEST]${Math.random().toString(36).substring(2, 8)}`,
      ...payload
    };

    this.logs.unshift(entry); // newest first
    if (this.logs.length > 200) {
      this.logs.pop();
    }

    this.notify();
    return entry;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.logs);
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.notify();
  }
}

export const cloudWatch = new CloudWatchLogger();
