import logging
import sys
from app.core.config import settings

def setup_logger():
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    logging.basicConfig(
        level=logging.INFO if settings.LOG_LEVEL == "INFO" else logging.DEBUG,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    logger = logging.getLogger("dimenshop")
    return logger

logger = setup_logger()
