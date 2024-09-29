import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Row, Col, Button, Form, Image, Container } from 'react-bootstrap';
import useProfileImage from './hook/useProfileImage.tsx'; // useProfileImage 훅을 import
import {updateMeRequest, UserPagePocket} from './function/userAxiosRequest.tsx';
import ProfileImageCropper from "./component/ProfileImageCropper.tsx";
import { useImmer } from 'use-immer';
import { useAppSelector } from "../../redux/store/hooks.ts";
import DatePicker from 'react-datepicker';  // react-datepicker import
import moment from 'moment';
import {showToast} from "../../lib/ToastNotification.ts";
import {ThreeValueBoolean} from "../../interface/OtherInterface.ts";  // 날짜 형식 포맷을 위해 moment 사용

// PersonalInfoEdit 컴포넌트
const PersonalInfoEdit = ({ showPersonalInfo, user }) => {
    const [password, setPassword] = useState('');
    const [birth, setBirth] = useState<Date | null>(user?.birth ? moment(user.birth).toDate() : null);
    const [gender, setGender] = useState(user?.gender || '');
    const [address, setAddress] = useState(user?.address || '');

    if (!showPersonalInfo) return null;

    return (
        <Container className="mt-4">
            <h3>개인정보 수정</h3>
            <Form>
                <Form.Group as={Row} controlId="formPassword" className="mb-3">
                    <Form.Label column sm="2">비밀번호</Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                {/* Date Picker로 변경된 생년월일 필드 */}
                <Form.Group as={Row} controlId="formBirthDate" className="mb-3">
                    <Form.Label column sm="2">생년월일</Form.Label>
                    <Col sm="10">
                        <DatePicker
                            selected={birth}
                            onChange={(date) => setBirth(date)}  // 날짜 선택 시 state 업데이트
                            dateFormat="yyyy-MM-dd"  // YYYY-MM-DD 형식
                            className="form-control"
                            placeholderText="YYYY-MM-DD"
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formGender" className="mb-3">
                    <Form.Label column sm="2">성별</Form.Label>
                    <Col sm="10">
                        <Form.Control
                            as="select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formAddress" className="mb-3">
                    <Form.Label column sm="2">주소</Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Button variant="primary" type="button" onClick={() => console.log('Personal Info Saved')}>
                    저장
                </Button>
            </Form>
        </Container>
    );
};

// ProfileEditPage 컴포넌트
const ProfileEdit = () => {
    const location = useLocation();

    const [userPagePocket, updateUserPagePocket] = useImmer<UserPagePocket>({
        userPage: location.state?.userPage
    });
    const myId = useAppSelector(state => state.auth.user.id);
    const isAuthTaskFinished = useAppSelector(state => state.auth.isAuthTaskFinished);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        if(isAuthTaskFinished !== ThreeValueBoolean.True){
            return;
        }

        // console.log("ProfileEdit - useEffect :: myId와 userPagePocket 확인");
        // console.log(myId);
        // console.log(JSON.stringify(userPagePocket, null, 2));

        // //만약에 myId와 pocket의 id가 다르면 해킹이다. 즉시 네비게이트하고 리턴한다.
        if(myId !== userPagePocket.userPage.user.id){
            showToast("error","잘못된 접근입니다.", 1000);
            void navigate(`/user/profile`);
            return;
        }
    }, [userPagePocket, myId, navigate, isAuthTaskFinished]);

    // useProfileImage 훅을 사용하여 이미지 관련 로직을 처리
    const {
        isCropping,
        uploadedImage,
        fileInputRef,
        handleImageClick,
        handleFileChange,
        handleImageError,
        handleCropped,
        closeCropper
    } = useProfileImage(userPagePocket?.userPage, updateUserPagePocket, myId);

    const handleSaveProfile = async () => {

        console.log('프로필 저장');
        //닉네임이랑 소개만
        const response = await updateMeRequest(myId, {
            nickname: userPagePocket.userPage.user.nickname,
            intro: userPagePocket.userPage.user.intro
        });
        console.log(response);
        if (response instanceof Error) {
            console.error("프로필 업데이트 실패: ", response);
            return;
        }

        location

        showToast("success","프로필 업데이트 성공", 1000);

    };

    //비밀번호 생년월일 성별 주소


    const handleTogglePersonalInfoEdit = () => {
        setShowPersonalInfo(!showPersonalInfo);
    };

    useEffect(() => {
        console.log("Location state after reload:", location.state);
    }, [location]);

    return (
        <Container className="mt-4">
            <h2>프로필 수정</h2>
            <Row className="align-items-center mb-4">
                <Col xs={12} md={3} className="d-flex justify-content-center">
                    <Image
                        src={uploadedImage || 'defaultImageURL'}
                        roundedCircle
                        onClick={handleImageClick}
                        onError={handleImageError}
                        style={{ width: '150px', height: '150px', cursor: 'pointer' }}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Col>
                <Col xs={12} md={9}>
                    <Form>
                        <Form.Group as={Row} controlId="formName" className="mb-3">
                            <Form.Label column sm="2">이름</Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="text"
                                    value={userPagePocket?.userPage?.user?.nickname || ''}
                                    onChange={
                                        (e) => updateUserPagePocket((draft) => {
                                            draft.userPage.user.nickname = e.target.value;
                                        })
                                    }
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formIntro" className="mb-3">
                            <Form.Label column sm="2">소개</Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={userPagePocket?.userPage?.user?.intro || ''}
                                    onChange={
                                        (e) => updateUserPagePocket((draft) => {
                                            draft.userPage.user.intro = e.target.value;
                                        })
                                    }
                                />
                            </Col>
                        </Form.Group>

                        <Button variant="primary" type="button" onClick={handleSaveProfile}>
                            프로필 저장
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Button variant="secondary" className="mb-4" onClick={handleTogglePersonalInfoEdit}>
                {showPersonalInfo ? '개인정보 수정 닫기' : '개인정보 수정'}
            </Button>

            {/* PersonalInfoEdit 컴포넌트 */}
            <PersonalInfoEdit showPersonalInfo={showPersonalInfo} user={userPagePocket.userPage.user} />

            {/* 크롭 모드일 때 크롭 컴포넌트 표시 */}
            {isCropping && uploadedImage && (
                <ProfileImageCropper
                    imageSrc={uploadedImage}
                    onCropped={handleCropped}
                    onClose={closeCropper}
                />
            )}
        </Container>
    );
};

const styles : {[key: string]: React.CSSProperties} = {
    reactDatepickerWrapper: {
        width: '100% !important',
    }

}

export default ProfileEdit;
