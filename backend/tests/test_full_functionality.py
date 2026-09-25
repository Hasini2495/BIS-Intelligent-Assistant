import io
import uuid
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_registration_and_login_flow(client: AsyncClient):
    # 1. Register a new user
    uid = uuid.uuid4().hex[:6]
    test_email = f"arjun_{uid}@example.com"
    reg_payload = {
        "name": "Arjun Sharma",
        "email": test_email,
        "password": "SecurePassword123!",
        "role": "user",
        "phone": "+919876543210",
        "organization": "National Quality Lab",
        "department": "Civil Testing"
    }
    reg_res = await client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert reg_data["accessToken"]
    assert reg_data["user"]["email"] == test_email
    token = reg_data["accessToken"]

    # 2. Duplicate registration fails
    dup_res = await client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 409

    # 3. Login with correct credentials
    login_res = await client.post("/api/auth/login", json={
        "email": test_email,
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert login_data["accessToken"]
    assert login_data["requires2Fa"] is False

    # 4. Login with incorrect password fails
    bad_pass_res = await client.post("/api/auth/login", json={
        "email": test_email,
        "password": "WrongPassword999!"
    })
    assert bad_pass_res.status_code == 401

    # 5. Login with non-existent user fails
    bad_user_res = await client.post("/api/auth/login", json={
        "email": f"nobody_{uid}@example.com",
        "password": "Password123!"
    })
    assert bad_user_res.status_code == 401

    # 6. Get Profile (/api/auth/me)
    me_res = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Arjun Sharma"

    # 7. Update Profile (/api/auth/profile)
    upd_res = await client.put(
        "/api/auth/profile",
        json={"name": "Dr. Arjun Sharma", "department": "Senior Standards Auditor"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert upd_res.status_code == 200
    assert upd_res.json()["name"] == "Dr. Arjun Sharma"
    assert upd_res.json()["department"] == "Senior Standards Auditor"

    # 8. Change Password (/api/auth/change-password)
    # Bad current password fails
    bad_cp = await client.post(
        "/api/auth/change-password",
        json={"currentPassword": "wrong", "newPassword": "NewPassword456!", "confirmPassword": "NewPassword456!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert bad_cp.status_code == 400

    # Successful password change
    good_cp = await client.post(
        "/api/auth/change-password",
        json={"currentPassword": "SecurePassword123!", "newPassword": "NewPassword456!", "confirmPassword": "NewPassword456!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert good_cp.status_code == 200

    # Login with new password succeeds
    login_new = await client.post("/api/auth/login", json={
        "email": test_email,
        "password": "NewPassword456!"
    })
    assert login_new.status_code == 200


@pytest.mark.asyncio
async def test_two_factor_auth_lifecycle(client: AsyncClient):
    # Register a dedicated user for 2FA test
    p_uid = uuid.uuid4().hex[:6]
    priya_email = f"priya_{p_uid}@example.com"
    reg_res = await client.post("/api/auth/register", json={
        "name": "Priya Verma",
        "email": priya_email,
        "password": "PriyaPassword123!",
        "phone": "+919123456789"
    })
    assert reg_res.status_code == 200
    token = reg_res.json()["accessToken"]

    # Check initial 2FA status (disabled)
    status_res = await client.get("/api/auth/2fa/status", headers={"Authorization": f"Bearer {token}"})
    assert status_res.status_code == 200
    assert status_res.json()["enabled"] is False

    # Initiate 2FA setup (triggers OTP dispatch)
    setup_res = await client.post("/api/auth/2fa/setup?method=sms", headers={"Authorization": f"Bearer {token}"})
    assert setup_res.status_code == 200
    setup_data = setup_res.json()
    assert setup_data["success"] is True
    v_id = setup_data["verificationId"]
    assert v_id is not None

    # Invalid code fails
    invalid_verify = await client.post(
        "/api/auth/2fa/enable",
        json={"verificationId": v_id, "code": "000000"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert invalid_verify.status_code == 400

    # Verify with correct code from test database helper
    # In console provider mode, let's query the DB for the code hash or test mock
    from app.core.database import async_session_maker
    from app.models.user import OTPVerification
    from sqlalchemy import select
    from app.services.otp_service import hash_otp_code

    async with async_session_maker() as session:
        rec = await session.execute(select(OTPVerification).where(OTPVerification.id == v_id))
        otp_rec = rec.scalar_one()
        # Set a known code hash for deterministic test
        otp_rec.code_hash = hash_otp_code("654321")
        await session.commit()

    # Now verify with 654321
    valid_verify = await client.post(
        "/api/auth/2fa/enable",
        json={"verificationId": v_id, "code": "654321"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert valid_verify.status_code == 200

    # Status is now enabled
    status_after = await client.get("/api/auth/2fa/status", headers={"Authorization": f"Bearer {token}"})
    assert status_after.json()["enabled"] is True

    # Next login requires 2FA!
    login_2fa_res = await client.post("/api/auth/login", json={
        "email": priya_email,
        "password": "PriyaPassword123!"
    })
    assert login_2fa_res.status_code == 200
    l_data = login_2fa_res.json()
    assert l_data["requires2Fa"] is True
    assert l_data["verificationId"] is not None
    login_v_id = l_data["verificationId"]

    # Set known hash for login verification
    async with async_session_maker() as session:
        rec2 = await session.execute(select(OTPVerification).where(OTPVerification.id == login_v_id))
        otp_rec2 = rec2.scalar_one()
        otp_rec2.code_hash = hash_otp_code("112233")
        await session.commit()

    # Complete 2FA login
    complete_res = await client.post("/api/auth/2fa/verify-login", json={
        "verificationId": login_v_id,
        "code": "112233"
    })
    assert complete_res.status_code == 200
    assert complete_res.json()["accessToken"]


@pytest.mark.asyncio
async def test_google_oauth_configuration_check(client: AsyncClient):
    res = await client.get("/api/auth/google/url")
    assert res.status_code == 200
    data = res.json()
    assert "configured" in data
    if not data["configured"]:
        assert "Google sign-in is not configured" in data["message"]


@pytest.mark.asyncio
async def test_file_upload_and_download_flow(client: AsyncClient):
    # 1. Upload a real PDF file
    sample_pdf_bytes = b"%PDF-1.4 sample test report content under Bureau of Indian Standards"
    files = {"file": ("Concrete_Durability_Test.pdf", sample_pdf_bytes, "application/pdf")}
    data = {"document_type": "compliance_evidence", "title": "Concrete Durability Report"}

    upload_res = await client.post("/api/documents/upload", files=files, data=data)
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    doc_id = upload_data["id"]
    assert doc_id.startswith("doc_")
    assert upload_data["status"] in ["uploaded", "indexed"]

    # 2. Download the uploaded document
    download_res = await client.get(f"/api/documents/{doc_id}/download")
    assert download_res.status_code == 200
    assert "attachment" in download_res.headers.get("content-disposition", "")
    assert download_res.content == sample_pdf_bytes

    # 3. Download a seeded sample file (e.g. LED_Bulb_TestReport.pdf)
    sample_download = await client.get("/api/documents/doc-1/download")
    assert sample_download.status_code == 200
    assert "LED_Bulb_TestReport.pdf" in sample_download.headers.get("content-disposition", "")
    assert sample_download.content.startswith(b"%PDF-1.4")

    # 4. Preview document
    preview_res = await client.get(f"/api/documents/{doc_id}/preview")
    assert preview_res.status_code == 200
    assert preview_res.json()["id"] == doc_id

    # 5. Delete document
    del_res = await client.delete(f"/api/documents/{doc_id}")
    assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_admin_metrics_and_analytics(client: AsyncClient):
    # Metrics
    metrics_res = await client.get("/api/admin/metrics")
    assert metrics_res.status_code == 200
    m = metrics_res.json()
    assert m["totalUsers"] >= 0
    assert m["totalDocuments"] >= 5
    assert m["indexedDocuments"] >= 5
    assert "documentIndexedPercentage" in m

    # Analytics with date ranges
    for r in ["7d", "30d", "90d"]:
        ana_res = await client.get(f"/api/admin/analytics?range={r}")
        assert ana_res.status_code == 200
        a = ana_res.json()
        assert a["timeRange"] == r
        assert len(a["dailyMetrics"]) > 0
        assert len(a["topQueries"]) > 0


@pytest.mark.asyncio
async def test_bookmarks_and_notifications_and_feedback(client: AsyncClient):
    # Notifications
    notifs_res = await client.get("/api/notifications")
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()
    assert len(notifs) >= 5
    n_id = notifs[0]["id"]

    # Mark read
    mark_res = await client.patch(f"/api/notifications/{n_id}/read")
    assert mark_res.status_code == 200

    # Bookmarks
    b_res = await client.get("/api/bookmarks")
    assert b_res.status_code == 200
    b_list = b_res.json()
    assert len(b_list) >= 5

    # Add Bookmark
    add_b = await client.post("/api/bookmarks", json={
        "itemId": "std-test-99",
        "itemType": "standard",
        "title": "IS 1786 High Strength Steel",
        "link": "/standards/std-5",
        "referenceNumber": "IS 1786"
    })
    assert add_b.status_code == 200
    created_b_id = add_b.json()["id"]

    # Delete Bookmark
    del_b = await client.delete(f"/api/bookmarks/{created_b_id}")
    assert del_b.status_code == 200

    # Feedback
    fb_res = await client.post("/api/feedback", json={
        "messageId": "msg-test-1",
        "conversationId": "conv-test-1",
        "rating": "helpful",
        "comment": "Accurate clause citations for IS 456 concrete grades"
    })
    assert fb_res.status_code == 200
    assert fb_res.json()["id"]


@pytest.mark.asyncio
async def test_hallmarking_verification(client: AsyncClient):
    # 1. Valid verified sample
    v_res = await client.post("/api/hallmarking/verify", json={"huid": "BJ9281"})
    assert v_res.status_code == 200
    v_data = v_res.json()
    assert v_data["isFormatValid"] is True
    assert v_data["isOfficiallyVerified"] is True
    assert "916" in v_data["purity"]

    # 2. Valid format but unindexed in local cache
    fmt_res = await client.post("/api/hallmarking/verify", json={"huid": "ZX9988"})
    assert fmt_res.status_code == 200
    fmt_data = fmt_res.json()
    assert fmt_data["isFormatValid"] is True
    assert fmt_data["isOfficiallyVerified"] is False
    assert "HUID format validated" in fmt_data["message"]

    # 3. Invalid format (< 6 chars)
    bad_res = await client.post("/api/hallmarking/verify", json={"huid": "A12"})
    assert bad_res.status_code == 200
    assert bad_res.json()["isFormatValid"] is False
