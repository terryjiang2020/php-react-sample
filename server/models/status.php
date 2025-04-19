<?php
/**
 * status.php - A simple status webservice that returns information about the system
 * 
 * This service can be used to verify the API is working correctly and provides
 * useful diagnostic information.
 */

class StatusService {
  private $startTime;
  
  public function __construct() {
    $this->startTime = microtime(true);
  }
  
  /**
   * Get system information and API status
   * 
   * @return array System status information 
   */
  public function getStatus() {
    // Calculate uptime
    $uptime = microtime(true) - $this->startTime;
    
    // Get server information
    $serverInfo = [
      'php_version' => phpversion(),
      'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
      'hostname' => gethostname(),
      'os' => PHP_OS,
      'time' => date('Y-m-d H:i:s'),
      'timezone' => date_default_timezone_get(),
      'request_time' => date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME']),
      'uptime_seconds' => round($uptime, 3),
      'memory_usage' => $this->formatBytes(memory_get_usage()),
      'memory_peak' => $this->formatBytes(memory_get_peak_usage())
    ];
    
    // Get API information
    $apiInfo = [
      'status' => 'online',
      'endpoints' => [
        '/teams' => ['GET', 'POST', 'DELETE', 'PATCH'],
        '/calendar' => ['GET', 'POST'],
        '/status' => ['GET']
      ],
      'framework' => 'Custom PHP API'
    ];
    
    // Return all data
    return [
      'status' => 'ok',
      'timestamp' => time(),
      'server' => $serverInfo,
      'api' => $apiInfo
    ];
  }
  
  /**
   * Format bytes to human-readable format
   */
  private function formatBytes($bytes, $precision = 2) { 
    $units = ['B', 'KB', 'MB', 'GB', 'TB']; 
    
    $bytes = max($bytes, 0); 
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
    $pow = min($pow, count($units) - 1); 
    
    $bytes /= pow(1024, $pow);
    
    return round($bytes, $precision) . ' ' . $units[$pow]; 
  }
}