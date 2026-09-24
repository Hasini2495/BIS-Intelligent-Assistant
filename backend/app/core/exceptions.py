from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class BISException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code

class NotFoundError(BISException):
    def __init__(self, message: str = "Not found"):
        super().__init__(message, 404)

class ValidationError(BISException):
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, 400)

class InsufficientEvidenceError(BISException):
    def __init__(self, message: str = "Insufficient evidence to answer"):
        super().__init__(message, 422)

class LLMProviderError(BISException):
    def __init__(self, message: str = "LLM provider error"):
        super().__init__(message, 502)

def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(BISException)
    async def bis_exception_handler(request: Request, exc: BISException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"message": exc.message, "type": exc.__class__.__name__}}
        )
