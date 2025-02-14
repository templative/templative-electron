import traceback
import json
from datetime import datetime
import asyncio
from typing import Optional
import aiohttp
import sys

class ErrorSeverity:
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"

class ErrorCollector:
    def __init__(self, error_webhook_url: str = "https://api.templative.net/logging"):
        self.error_webhook_url = error_webhook_url
        self.errors = []
        
        # Add global exception handler
        sys.excepthook = self.handle_uncaught_exception

    def handle_uncaught_exception(self, exc_type, exc_value, exc_traceback):
        asyncio.create_task(self.collect_error(
            exc_value,
            "python_uncaught_exception",
            {
                "exc_type": str(exc_type),
                "application_layer": "python"
            },
            ErrorSeverity.CRITICAL
        ))
        # Still print to stderr for local debugging
        sys.__excepthook__(exc_type, exc_value, exc_traceback)

    async def collect_error(self, error: Exception, route: str, additional_context: dict = None, severity: str = ErrorSeverity.ERROR):
        error_data = {
            "error": {
                "type": type(error).__name__,
                "message": str(error),
                "stacktrace": traceback.format_exc()
            },
            "route": route,
            "additionalContext": additional_context or {},
            "severity": severity
        }
        
        self.errors.append(error_data)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.error_webhook_url,
                    json=error_data,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    if response.status != 200:
                        print(f"Failed to send error to collection server. Status: {response.status}")
        except Exception as e:
            print(f"Failed to send error to collection server: {str(e)}")

error_collector = ErrorCollector()  # Initialize a global instance 