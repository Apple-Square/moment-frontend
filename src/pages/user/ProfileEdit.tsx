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
import BackButton from "../common/components/BackButton.tsx";
import DaumPostcode from "react-daum-postcode";  // 날짜 형식 포맷을 위해 moment 사용

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
const PersonalInfoEdit = ({ showPersonalInfo, user, myId }) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [birth, setBirth] = useState<Date | null>(user?.birth ? moment(user.birth).toDate() : null);
    const [gender, setGender] = useState(user?.gender || '');
    const [address, setAddress] = useState(user?.address || '');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [addressModalToggle, setAddressModalToggle] = useState(false);

    const navigate = useNavigate();

    const handleSavePersonalInfo = async () => {
        // 입력 데이터 검증
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/; // 생년월일 형식: YYYY-MM-DD
        const formattedBirth = birth ? birth.toISOString().split('T')[0] : undefined;
        let isValidBirth = false;
        if (formattedBirth != null) { // birth가 없거나 형식이 맞는 경우에만 true
            isValidBirth = !birth || birthDateRegex.test(formattedBirth);
        } else {
            isValidBirth = true;
        }

        const isValidGender = !gender || ["MALE", "FEMALE", ""].includes(gender);
        const isValidAddress = !address || address.length >= 0;

        if (!isValidBirth || !isValidGender || !isValidAddress) {
            alert(`isValidBirth: ${isValidBirth}, isValidAddress: ${isValidAddress}, isValidGender: ${isValidGender}, ${gender}`);
            showToast('fail', "입력한 정보가 올바르지 않습니다. 다시 확인해주세요.", 500);
            return;
        }

        // 유효성 검사를 통과한 경우에만 업데이트 요청
        const response = await updateMeRequest(myId, {
            birth: birth || "",  // 빈 값은 전송하지 않음
            gender: gender || "",
            address: address || "",
        });

        console.log(response);
        if (response instanceof Error) {
            console.error("개인 정보 업데이트 실패: ", response);
            return;
        }
        void navigate(`/user/profile`);
    };



    // 토글 함수
    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
    };

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setAddress(fullAddress);  // 선택된 주소를 state에 저장
        setAddressModalToggle(false);     // 주소 검색 창 닫기
    };

    if (!showPersonalInfo) return null;
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
                        <div style={{position:'relative'}}>
                            <DatePicker
                                selected={birth}
                                onChange={(date) => setBirth(date)}  // 날짜 선택 시 state 업데이트
                                dateFormat="yyyy-MM-dd"  // YYYY-MM-DD 형식
                                customInput={<CustomInput/>}
                                placeholderText="YYYY-MM-DD"
                            />
                            {birth && (
                                <span onClick={() => setBirth(null)} style={styles.clearIcon}>×</span>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formGender" className="m-3" style={styles.profileInputWrapper}>
                        <Form.Label className="p-0" style={styles.inputLabel}>성별</Form.Label>
                        <div style={{position:'relative'}}>
                            <Form.Control
                                as="select"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                style={styles.profileInput}
                            >
                                <option value="male">남성</option>
                                <option value="female">여성</option>
                                <option value="">알려지지 않음</option>
                            </Form.Control>
                            {gender !== "" && (
                                <span onClick={() => setGender("")} style={styles.clearIcon}>×</span>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formAddress" className="m-3" style={styles.profileInputWrapper}>
                        <Form.Label className="p-0" style={styles.inputLabel}>주소</Form.Label>
                        <div style={{position:'relative'}}>
                        <Form.Control
                            type="text"
                            readOnly
                            value={address}
                            placeholder="주소를 검색하세요"
                            onClick={() => setAddressModalToggle((prev)=> !prev)}
                            style={styles.profileInput}
                        />
                        {address && (
                            <span onClick={() => setAddress('')} style={styles.clearIcon}>×</span>
                        )}
                        </div>
                        {addressModalToggle && (
                            <div style={{ position: 'relative', zIndex: 100 }}>
                                <DaumPostcode onComplete={handleComplete} />
                            </div>
                        )}
                    </Form.Group>

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
                        <button style={styles.button} type="button" onClick={handleSavePersonalInfo}
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
    const isFirstAuthTaskFinished = useAppSelector(state => state.auth.isFirstAuthTaskFinished);
    const [showPersonalInfo, setShowPersonalInfo] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        if(isFirstAuthTaskFinished !== ThreeValueBoolean.True){
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
    }, [userPagePocket, myId, navigate, isFirstAuthTaskFinished]);

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
                        src={userPagePocket.userPage.user.profileImage || 'defaultImageURL'}
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
            <PersonalInfoEdit showPersonalInfo={showPersonalInfo} user={userPagePocket.userPage.user} myId={myId} />

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
        marginBottom: '1rem'
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
    },
    clearIcon: {
        position: 'absolute',
        inset : '-10% 0 auto auto',
        cursor: 'pointer',
        color: 'gray',
        fontSize: '18px',
        width: 'auto'
    },
};
export default ProfileEdit;
