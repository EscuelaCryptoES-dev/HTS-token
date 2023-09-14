const { expect } = require('chai');
const { ethers } = require('hardhat');

let HTS;
let myHTS;

let deployer;
let teacher;
let student;

describe('HTS-ERC20', function () {

  this.beforeAll(async function(){
    // Deploy
    [deployer, teacher, student] = await ethers.getSigners();

    const HTSFactory = await ethers.getContractFactory('HappyTribe');
    HTS = await HTSFactory.deploy(teacher.address);
    await HTS.deployed();

    myHTS = HTS.connect(teacher);
  });

  it('Name should be correct', async function () {
    expect(await HTS.name()).to.equal('HappyTribe');
  });

  it('Symbol should be correct', async function () {
    expect(await HTS.symbol()).to.equal('HTS');
  });

  it('Deployer should not have any tokens', async function() {
    expect(await HTS.balanceOf(deployer.address)).to.equal(0);
  })

  it('Teacher should have total supply of tokens', async function () {
    const teacherBalance = await myHTS.balanceOf(teacher.address);
    const totalSupply = await myHTS.totalSupply();
    expect(teacherBalance).to.equal(totalSupply);
  });

  it('Deployer is not the owner of SC', async function() {
    await expect(HTS.connect(deployer).mint(student.address, ethers.utils.parseEther("10"))).to.be.reverted;
  })

  it('Should transfer tokens between accounts', async function () {
    const initialTeacherBalance = await myHTS.balanceOf(teacher.address);
    const transferAmount = ethers.utils.parseEther("100");
    await myHTS.transfer(student.address, transferAmount);

    const studentBalance = await myHTS.balanceOf(student.address);
    expect(studentBalance).to.equal(transferAmount);

    const teacherBalance = await myHTS.balanceOf(teacher.address);
    expect(teacherBalance).to.equal(initialTeacherBalance - transferAmount);
  });

  it('Should fail if sender does not have enough tokens', async function () {
    const initialDeployerBalance = await myHTS.balanceOf(deployer.address);
    const transferAmount = initialDeployerBalance + 1;

    await expect(HTS.connect(deployer).transfer(teacher.address, transferAmount)).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance'
    );
  });
});
