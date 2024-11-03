import React, {useState, useEffect, ElementType, ReactElement} from 'react';
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
import {ThreeValueBoolean} from "../../interface/OtherInterface.ts";
import BackButton from "../common/components/BackButton.tsx";  // 날짜 형식 포맷을 위해 moment 사용

type CustomInputProps = {
    value?: string;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(({ value, onClick, onChange }, ref) => (
    <input
        ref={ref}
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder="YYYY-MM-DD"
        style={styles.profileInput}
    />
));

type FormFieldProps = {
    controlId: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    as?: ElementType; // `as`의 타입을 `ElementType`으로 지정
    rows?: number;
};

const FormField = ({ controlId, label, type = 'text', value, onChange, as = 'input', rows = 1 }: FormFieldProps): ReactElement => (
    <Form.Group as={Row} controlId={controlId} className="m-3" style={styles.profileInputWrapper}>
        <Form.Label className="p-0" style={styles.inputLabel}>{label}</Form.Label>
        <Form.Control
            className="w-100"
            type={type}
            as={as}
            rows={rows}
            value={value}
            onChange={onChange}
            style={styles.profileInput}
        />
    </Form.Group>
);


// PersonalInfoEdit 컴포넌트
const PersonalInfoEdit = ({ showPersonalInfo, user }) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [birth, setBirth] = useState<Date | null>(user?.birth ? moment(user.birth).toDate() : null);
    const [gender, setGender] = useState(user?.gender || '');
    const [address, setAddress] = useState(user?.address || '');
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    if (!showPersonalInfo) return null;

    // 토글 함수
    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
    };

    return (
        <div className="mt-4">
            <Row>
                <Col xs={2} style={{padding:'0px',}} className="d-flex justify-content-center">

                </Col>
                <Col xs={10} style={{padding:'0px 0px 0px 0px',}} className="d-flex align-items-center justify-content-left">
                    <h5 style={{fontWeight : "bold", margin:'0px'}}>개인정보 수정</h5>
                </Col>
            </Row>

            <Row>
                <Form>
                    <Form.Group as={Row} controlId="formBirthDate" className="m-3" style={styles.profileInputWrapper}>
                        <Form.Label className="p-0" style={styles.inputLabel}>생년월일</Form.Label>
                        <DatePicker
                            selected={birth}
                            onChange={(date) => setBirth(date)}  // 날짜 선택 시 state 업데이트
                            dateFormat="yyyy-MM-dd"  // YYYY-MM-DD 형식
                            customInput={<CustomInput/>}
                            placeholderText="YYYY-MM-DD"
                        />
                    </Form.Group>

                    <Form.Group as={Row} controlId="formGender" className="m-3" style={styles.profileInputWrapper}>
                        <Form.Label className="p-0" style={styles.inputLabel}>성별</Form.Label>
                        <Form.Control
                            as="select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            style={styles.profileInput}
                        >
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </Form.Control>
                    </Form.Group>

                    <FormField
                        controlId="formAddress"
                        label="주소"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    {showPasswordFields && (
                        <>
                            <FormField
                                controlId="formPassword"
                                label="현재 비밀번호"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormField
                                controlId="formNewPassword"
                                label="새 비밀번호"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <FormField
                                controlId="formNewPasswordConfirm"
                                label="새 비밀번호 확인"
                                type="password"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            />
                        </>
                    )}
                    <span
                        onClick={togglePasswordFields}
                        style={{marginLeft:"16px" ,color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>비밀번호 변경하기</span>
                    <div className="d-flex justify-content-end">
                        <button style={styles.button} type="button" onClick={() => console.log('Personal Info Saved')}
                                className="m-3">
                            저장
                        </button>
                    </div>


                </Form>
            </Row>
        </div>
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
        void navigate(`/user/profile`);
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
            <Row>
                <Col xs={2} style={{padding:'0px',}} className="d-flex justify-content-center">
                    <BackButton/>
                </Col>
                <Col xs={10} style={{padding:'0px 0px 0px 0px',}} className="d-flex align-items-center justify-content-left">
                    <h5 style={{fontWeight : "bold", margin:'0px'}}>프로필 편집</h5>
                </Col>
            </Row>

            <Row className="align-items-center">
                <Col xs={12} md={3} className="d-flex justify-content-center mt-4 mb-4">
                    <Image
                        src={uploadedImage || 'defaultImageURL'}
                        roundedCircle
                        onClick={handleImageClick}
                        onError={handleImageError}
                        style={{ width: '100px', height: '100px', cursor: 'pointer' }}
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
                        <FormField
                            controlId="formName"
                            label="이름"
                            type="text"
                            value={userPagePocket?.userPage?.user?.nickname || ''}
                            onChange={(e) =>
                                updateUserPagePocket((draft) => {
                                    draft.userPage.user.nickname = e.target.value;
                                })
                            }
                        />
                        <FormField
                            controlId="formIntro"
                            label="소개"
                            as="textarea"
                            rows={3}
                            value={userPagePocket?.userPage?.user?.intro || ''}
                            onChange={(e) =>
                                updateUserPagePocket((draft) => {
                                    draft.userPage.user.intro = e.target.value;
                                })
                            }
                        />

                        <div className="d-flex justify-content-end m-3">
                            <button type="button" style={styles.button} onClick={handleSaveProfile}>
                                프로필 저장
                            </button>
                        </div>
                </Form>
            </Col>
        </Row>

    <Button variant="secondary" className="m-3" onClick={handleTogglePersonalInfoEdit}>
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

const styles: { [key: string]: React.CSSProperties } = {
    profileInputWrapper: {
        border: '1px solid #e0e0e0',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        marginBottom: '1rem',
    },
    inputLabel: {
        fontSize: '0.75rem',
        color: '#a0a0a0',
        marginBottom: '4px',
        padding:'0px',
        display: 'block', // 라벨을 블록 요소로 처리해 Col 위쪽에 위치시킴
    },
    profileInput: {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        fontSize: '1rem',
        color: '#333',
        backgroundColor: 'transparent',
        padding: '0',
    },
    button : {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#3a86ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
    }
};
export default ProfileEdit;
