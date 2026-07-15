from fastapi import HTTPConnection, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.utils.logger import logger

security_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
  """
  Validate JWT bearer token from authorization headers using Supabase secret key.
  Returns payload claims (sub/user_id, role, email) if valid.
  """
  token = credentials.credentials
  try:
      payload = jwt.decode(
          token,
          settings.SUPABASE_JWT_SECRET,
          algorithms=["HS256"],
          options={"verify_aud": False} # Supabase JWT aud might be "authenticated"
      )
      
      user_id: str = payload.get("sub")
      if user_id is None:
          raise HTTPException(
              status_code=status.HTTP_401_UNAUTHORIZED,
              detail="Invalid token claims: missing user identifier",
          )
      
      # Extract metadata/roles
      user_metadata = payload.get("user_metadata", {})
      role = user_metadata.get("role", "buyer")

      return {
          "user_id": user_id,
          "email": payload.get("email"),
          "role": role,
          "raw_payload": payload
      }
  except JWTError as e:
      logger.warning(f"JWT verification failure: {str(e)}")
      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail="Could not validate credentials",
          headers={"WWW-Authenticate": "Bearer"},
      )

def verify_seller_role(current_user: dict = Depends(get_current_user)) -> dict:
  """
  Helper dependency ensuring user has seller authority.
  """
  if current_user.get("role") != "seller" and current_user.get("role") != "admin":
      raise HTTPException(
          status_code=status.HTTP_403_FORBIDDEN,
          detail="Operation forbidden: restricted to sellers only",
      )
  return current_user
