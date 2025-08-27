// MongoDB Replica Set Initialization Script
print('Starting MongoDB replica set initialization...');

// Wait for MongoDB to be fully ready
sleep(10000);

try {
  // Check if replica set is already initialized
  var status;
  try {
    status = rs.status();
    if (status.ok === 1) {
      print('Replica set already initialized');
      quit(0);
    }
  } catch (e) {
    // Expected if not initialized yet
    print('Replica set not initialized yet, proceeding...');
  }
  
  // Initialize replica set
  var config = {
    "_id": "rs0",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "mongodb:27017",
        "priority": 1
      }
    ]
  };
  
  var result = rs.initiate(config);
  print('Replica set initiation result:', JSON.stringify(result));
  
  // Wait for replica set to be ready
  var maxAttempts = 30;
  var attempt = 0;
  var isReady = false;
  
  while (!isReady && attempt < maxAttempts) {
    try {
      var status = rs.status();
      if (status.ok === 1 && status.members && status.members[0] && status.members[0].state === 1) {
        isReady = true;
        print('Replica set is ready and primary is elected');
      } else {
        print('Waiting for replica set to be ready... attempt', attempt + 1, 'status:', JSON.stringify(status));
        sleep(3000);
      }
    } catch (e) {
      print('Checking replica set status... attempt', attempt + 1, 'error:', e.message);
      sleep(3000);
    }
    attempt++;
  }
  
  if (isReady) {
    print('MongoDB replica set initialized successfully');
    
    // Create admin user first
    db = db.getSiblingDB('admin');
    try {
      db.createUser({
        user: 'admin',
        pwd: 'password',
        roles: ['root']
      });
      print('Admin user created successfully');
    } catch (e) {
      if (e.message && e.message.includes('already exists')) {
        print('Admin user already exists');
      } else {
        print('Error creating admin user:', e.message);
      }
    }
    
    // Create application database and user
    db = db.getSiblingDB('Nagrik');
    try {
      db.createUser({
        user: 'naagrik_user',
        pwd: 'naagrik_password',
        roles: [
          {
            role: 'readWrite',
            db: 'Nagrik'
          }
        ]
      });
      print('Application user created successfully');
    } catch (e) {
      if (e.message && e.message.includes('already exists')) {
        print('Application user already exists');
      } else {
        print('Error creating application user:', e.message);
      }
    }
  } else {
    print('Failed to initialize replica set within timeout');
    quit(1);
  }
  
} catch (e) {
  if (e.message && e.message.includes('already initialized')) {
    print('Replica set already initialized');
  } else {
    print('Error initializing replica set:', e.message);
    quit(1);
  }
}

print('Initialization complete');
quit(0);
