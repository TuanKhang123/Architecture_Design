{/* <form action="" onSubmit={onSubmit}>
    <div className='userprofile__form'>
        <label className='userprofile__form-text'>ADDRESS</label>
        <div className='userprofile__form-birth'>

            <select name="province" id="pet-select" className='userprofile__form-birth-input' onChange={(e) => handleprovince(e)}>
                <option value="" placeholder=''>Province</option>
                {
                    provinces.results
                        ? provinces.results.map((province) => (
                            <option key={province.province_id} value={province.province_id}> {province.province_name}</option>
                        ))
                        : null
                }
            </select>

            <select name="district" id="pet-select" className='userprofile__form-birth-input' onChange={(e) => handleDistrict(e)}>
                <option value="" placeholder=''>District</option>
                {
                    districtes.results
                        ? districtes.results.map((district) => (
                            <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
                        ))
                        : null
                }
            </select>

            <select name="wards" id="pet-select" className='userprofile__form-birth-input' onChange={(e) => handleWard(e)}>
                <option value="" placeholder=''>Wards</option>
                {
                    wards.results
                        ? wards.results.map((ward) => (
                            <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>
                        ))
                        : null
                }
            </select>
        </div>

    </div>

    <div className='userprofile__form'>
        <label className='userprofile__form-text'>ADDRESS DETAIL</label>
        <input placeholder='Add address detail' className='userprofile__form-input' type="text" name='username' />
    </div>

    <div className='userprofile__form'>
        <button type="submit" className='userprofile__form-update'>UPDATE INFOMATION</button>
    </div>
</form>  */}