# Stub security module
def verify_token(token: str) -> bool:
    return True

def get_current_user():
    return {"id": "guest_user", "roles": ["user"]}
